const { govukDate } = require('@x-govuk/govuk-prototype-filters')

// Helper function: Save and redirect based on current step or returnUrl
  const saveAndRedirect = (claim, req, res, nextRoute) => {
  const completed = req.body.completedSection
  const returnUrl = req.query.returnUrl

  claim.status = 'In progress'

  // ✅ Ensure route name only is stored
  claim.lastVisitedStep = nextRoute

  if (completed === 'No') {
    return res.redirect(`/provider/save/${claim.id}`)
  }

  if (returnUrl) {
    return res.redirect(returnUrl)
  }

  return res.redirect(`/provider/${nextRoute}/${claim.id}`)
}


module.exports = (router) => {

  const claimsData = require('../data/claims.json')
  console.log('📁 Claims loaded from JSON:', claimsData.length)

  router.use((req, res, next) => {
  if (!req.session.data.claims) {
    req.session.data.claims = JSON.parse(JSON.stringify(claimsData))
    console.log('✅ Claims seeded:', req.session.data.claims.length)
    }
    next()
  })



const getClaim = (req, res) => {
  const claims = req.session.data.claims || []
  return claims.find(claim => String(claim.id) === req.params.claimId)
}



   // ================================
  // PROVIDER DASHBOARD
  // ================================



// GET: Active claims (Not started / In progress / Overdue )
router.get('/provider', (req, res) => {
  const allClaims = req.session.data.claims || []

  const excludedStatuses = ['Approved', 'Pending', 'Rejected']
  const activeClaims = allClaims.filter(claim =>
    !excludedStatuses.includes(claim.status?.trim())
  )

  console.log('✅ Filtered active claims:', activeClaims.map(c => `${c.claimantName} (${c.status})`))

  res.render('provider/index', {
    claims: activeClaims
  })
})





// POST: Mark claim as Verified (from check screen) and go to completed claims table
router.post('/provider/index/:claimId', (req, res) => {
  const claims = req.session.data.claims || []
  const claim = claims.find(c => String(c.id) === req.params.claimId)

  if (!claim) {
    return res.status(404).send('Claim not found')
  }

  // Update status to Dfe pending
  // claim.status = 'Pending'

  // Store timestamp for ordering
  const now = new Date()
  const formatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const iso = now.toISOString().split('T')[0]

  claim.dateVerified = formatted
  claim.dateVerifiedIso = iso

  // 🆕 Store last updated claim for ordering
  req.session.data.lastUpdatedClaimId = claim.id

  // Flash confirmation
  req.flash(
    'success',
    `Claim verified <br> <a class="govuk-link" href="/provider/completed/show/${claim.id}">View verified claim</a>`
  )

  // ✅ Redirect to completed claims screen instead of main dashboard
  res.redirect('/provider/completed')
})



  // ================================
  // WHO WILL VERIFY
  // ================================

  // GET: Who will verify selection screen
  router.get('/provider/who-will-verify/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    res.render('provider/who-will-verify', { claim })
  })


// POST: Save who will verify and redirect accordingly
router.post('/provider/who-will-verify/:claimId', (req, res) => {
  const claimId = req.params.claimId
  const whoWillVerify = req.body.whoWillVerify
  const claims = req.session.data.claims || []

  const claim = claims.find(claim => String(claim.id) === claimId)
  if (!claim) {
    return res.status(404).send('Claim not found')
  }

  // Save exactly what was submitted
  claim.verifier = whoWillVerify
  claim.status = 'Not started'
  claim.assignedTo = whoWillVerify // ← no string replacement
  claim.assignedDate = new Date().toISOString()

  req.flash('success',
    'Claim assigned to <strong>' + claim.assignedTo +
    '</strong> on <span class="govuk-!-font-weight-bold">' +
    govukDate(claim.assignedDate) + '</span>'
  )

  if (whoWillVerify === 'Me - [current_user]') {
    return res.redirect(`/provider/role-and-experience/${claimId}`)
  } else {
    return res.redirect('/provider')
  }
})




  // ================================
  // SHOW CLAIM (Review and verification steps)
  // ================================



  // GET: Claim review screen
  router.get('/provider/check/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    res.render('provider/check', { claim })
  })

 router.post('/provider/check/:claimId', (req, res) => {
  const claims = req.session.data.claims || []
  const claim = claims.find(c => String(c.id) === req.params.claimId)

  if (!claim) {
    return res.status(404).send('Claim not found')
  }

  // Save all radio values
  claim.teachingResponsibilities = req.body.teachingResponsibilities
  claim.first5Years = req.body.first5Years
  claim.hasTeachingQualification = req.body.hasTeachingQualification
  claim.contractType = req.body.contractType

  // If "Save and come back later"
  if (req.body.action === 'save') {
    claim.status = 'In progress'
    claim.assignedTo = 'You (current user)'
    req.flash('success', 'Your answers have been saved. You can come back and complete them later.')
    return res.redirect(`/provider/save/${claim.id}`)
  }

  // Branch based on contract type
  const contractType = claim.contractType

  if (contractType === 'Permanent') {
    return res.redirect(`/provider/performance-and-discipline/${claim.id}`)
  }

  if (contractType === 'Fixed-term') {
    return res.redirect(`/provider/fixed-term-academic-year/${claim.id}`)
  }

  if (contractType === 'Variable hours') {
    return res.redirect(`/provider/variable-contract-academic-term/${claim.id}`)
  }

  // Fallback
  req.flash('error', 'Select a contract type to continue')
  return res.redirect(`/provider/check/${claim.id}`)
})

  


  // ================================
  // INTERSTITIAL / INFO PAGES
  // ================================

  // GET: Save and come back confirmation page
  router.get('/provider/save/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    res.render('provider/save', { claim })
  })

  // GET: first enrty to PV form
  router.get('/provider/start-verifying/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    res.render('provider/start-verifying', { claim })
  })

  // GET: Finish-verifying screen (second entry)
  router.get('/provider/finish-verifying/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)

    if (!claim) return res.status(404).send('Claim not found')

    res.render('provider/finish-verifying', { claim })
  })

  // POST: if Yes go to first part of verification, if No go to read-only view
  router.post('/provider/start-verifying/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    // Optionally set to In progress if you want
    claim.status = 'Not started'
    claim.assignedTo = 'Me - [current_user]'
    claim.assignedDate = new Date().toISOString()
  
    res.redirect(`/provider/member-of-staff/${claim.id}`)
  })

  /////confirm FINISH VERIFICATION
  router.post('/provider/confirm-finish-verifier/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
  
    if (!claim) return res.status(404).send('Claim not found')
  
    const userChoice = req.body.continueVerification
  
    if (userChoice === 'Yes') {
      // Assign to current user
      claim.assignedTo = 'You - [current_user]'
      claim.status = 'In progress'
      claim.assignedDate = new Date().toISOString()
  
      // Return to the screen they left
      // OR ensures any claim with no recorded lastVisitedStep will now begin at your new first screen.
      const step = claim.lastVisitedStep || 'member-of-staff'
      return res.redirect(`/provider/${step}/${claim.id}`)

    }
  
    // Otherwise show read-only view
    req.flash('success', 'Claim: read only mode')
    return res.redirect(`/provider/read-only/${claim.id}`)
  })
  
  
  

  // GET: Read-only view of a claim
  router.get('/provider/read-only/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(claim => String(claim.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    res.render('provider/read-only', { claim })
  })
  

  // GET: Verified claim summary screen
  router.get('/provider/verified/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    res.render('provider/verified', { claim })
  })







  // ================================
  // Multi-step form flow
  // ================================


  // GET : Member of staff
  router.get('/provider/member-of-staff/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const returnUrl = req.query.returnUrl
    res.render('provider/member-of-staff', { 
      claim, 
      returnUrl 
    })
  })



  // POST: Member of staff
  router.post('/provider/member-of-staff/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.teachingResponsibilities = req.body.teachingResponsibilities
    claim.status = 'In progress'
    claim.lastVisitedStep = 'member-of-staff'

    if (req.body.action === 'save') {
      claim.assignedTo = 'You (current user)'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    const returnUrl = req.body.returnUrl
    const nextStep = `/provider/role-and-experience/${claim.id}`
    return res.redirect(`${nextStep}?returnUrl=${encodeURIComponent(returnUrl)}`)
  })



  // GET: Role and experience
  router.get('/provider/role-and-experience/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const returnUrl = req.query.returnUrl

    res.render('provider/role-and-experience', {
      claim,
      returnUrl
    })
  })



  // POST: Role and experience
  router.post('/provider/role-and-experience/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    // ✅ teachingResponsibilities is now handled in member-of-staff
    claim.first5Years = req.body.first5Years
    claim.hasTeachingQualification = req.body.hasTeachingQualification
    claim.qualificationMitigations = req.body.qualificationMitigations
    claim.status = 'In progress'
    claim.lastVisitedStep = 'role-and-experience'

    // Save and come back later
    if (req.body.action === 'save') {
      claim.assignedTo = 'You (current user)'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    const returnUrl = req.body.returnUrl

    // 👇 Branching logic if qualification mitigation is needed
    if (claim.hasTeachingQualification === 'No, but is planning to enrol on one') {
      const redirectUrl = `/provider/qualification-mitigations/${claim.id}`
      return returnUrl
        ? res.redirect(`${redirectUrl}?returnUrl=${encodeURIComponent(returnUrl)}`)
        : res.redirect(redirectUrl)
    }

    // 👇 If returning from check, go back there
    if (returnUrl) {
      return res.redirect(returnUrl)
    }

    // 👉 Otherwise, continue in normal flow
    return saveAndRedirect(claim, req, res, 'type-of-contract')
  })





  //////////////////////////////////////////////////////////////////////////////////

  // GET: Qualification mitigations
  router.get('/provider/qualification-mitigations/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const returnUrl = req.query.returnUrl
    res.render('provider/qualification-mitigations', { claim, returnUrl })
  })



  // POST: Qualification mitigations
  router.post('/provider/qualification-mitigations/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.qualificationMitigations = req.body.qualificationMitigations
    claim.status = 'In progress'
    claim.lastVisitedStep = 'qualification-mitigations'

    if (req.body.action === 'save') {
      claim.assignedTo = 'You (current user)'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    // 👇 return to check page if it came from there
    const returnUrl = req.body.returnUrl
    if (returnUrl) {
      return res.redirect(returnUrl)
    }

    // 👉 otherwise continue journey
    return saveAndRedirect(claim, req, res, 'type-of-contract')
  })




  //////////////////////////////////////////////////////////////////////////////////

  // GET: Type of contract
  router.get('/provider/type-of-contract/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const returnUrl = req.query.returnUrl
    res.render('provider/type-of-contract', { claim, returnUrl }) // ✅ pass it in
  })


  
  // POST: Type of contract
  router.post('/provider/type-of-contract/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const contractType = req.body.contractType
    claim.contractType = contractType
    claim.status = 'In progress'
    claim.lastVisitedStep = 'type-of-contract'

    if (req.body.action === 'save') {
      claim.assignedTo = 'You (current user)'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    const returnUrl = req.body.returnUrl

    // 🔀 Branch: Fixed-term
    if (contractType === 'Fixed-term') {
      return res.redirect(`/provider/fixed-term-contract-academic-year/${claim.id}?returnUrl=${encodeURIComponent(returnUrl)}`)
    }

    // 🔀 Branch: Variable hours
    if (contractType === 'Variable hours') {
      return res.redirect(`/provider/variable-contract-academic-term/${claim.id}?returnUrl=${encodeURIComponent(returnUrl)}`)
    }

    // 🔀 Branch: Employed by another organisation
    if (contractType === 'Employed by another organisation (for example, an agency or contractor)') {
      return saveAndRedirect(claim, req, res, 'performance-and-discipline')
    }

    // 🔁 Permanent (and default): go to returnUrl or next step
    if (returnUrl) {
      return res.redirect(returnUrl)
    }

    return saveAndRedirect(claim, req, res, 'performance-and-discipline')
  })




  //////////////////////////////////////////////////////////////////////////////////


  // GET: Fixed-term contract academic year
  router.get('/provider/fixed-term-contract-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const returnUrl = req.query.returnUrl
    res.render('provider/fixed-term-contract-academic-year', { claim, returnUrl }) // ✅ make sure it's passed
  })


  // POST: Fixed-term contract academic year
  router.post('/provider/fixed-term-contract-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.fixedTermAcademicYear = req.body.fixedTermAcademicYear

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      claim.assignedTo = 'You (current user)'
      claim.lastVisitedStep = 'fixed-term-contract-academic-year'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    const returnUrl = req.body.returnUrl
    if (returnUrl) {
      return res.redirect(returnUrl) // ✅ go back to check
    }


    return saveAndRedirect(claim, req, res, 'performance-and-discipline')

  })


  
  //////////////////////////////////////////////////////////////////////////////////



  // GET: Variable contract academic term
  router.get('/provider/variable-contract-academic-term/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const returnUrl = req.query.returnUrl
    res.render('provider/variable-contract-academic-term', { claim, returnUrl })

  })

  
  // POST: Variable contract academic term
  router.post('/provider/variable-contract-academic-term/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.variableContractAcademicTerm = req.body.variableContractAcademicTerm

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      claim.assignedTo = 'You (current user)'
      claim.lastVisitedStep = 'variable-contract-academic-term'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    const returnUrl = req.body.returnUrl
    return res.redirect(`/provider/variable-contract-timetabled-hours-in-term/${claim.id}?returnUrl=${encodeURIComponent(returnUrl)}`)

    return saveAndRedirect(claim, req, res, 'variable-contract-timetabled-hours-in-term')
  })

    

  //////////////////////////////////////////////////////////////////////////////////
  
  
  // GET: Variable contract individual hours in term
  router.get('/provider/variable-contract-timetabled-hours-in-term/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const returnUrl = req.query.returnUrl
    res.render('provider/variable-contract-timetabled-hours-in-term', { claim, returnUrl })

  })


  // POST: Variable contract timetabled hours in term
  router.post('/provider/variable-contract-timetabled-hours-in-term/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.variableContractTimetabledHours = req.body.variableContractTimetabledHours

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      claim.assignedTo = 'You (current user)'
      claim.lastVisitedStep = 'variable-contract-timetabled-hours-in-term'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    const returnUrl = req.body.returnUrl
    if (returnUrl) {
      return res.redirect(returnUrl)
    }
    return saveAndRedirect(claim, req, res, 'performance-and-discipline')

  })

    

  //////////////////////////////////////////////////////////////////////////////////
  
  
  // GET: Performance and discipline
  router.get('/provider/performance-and-discipline/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const returnUrl = req.query.returnUrl // 🧠 extract from query string

    res.render('provider/performance-and-discipline', {
      claim,
      returnUrl // ✅ pass to template
    })
  })


  // POST: Performance and discipline
  router.post('/provider/performance-and-discipline/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    // Save submitted values
    claim.performanceMeasures = req.body.performanceMeasures
    claim.disciplinaryAction = req.body.disciplinaryAction
    claim.status = 'In progress'
    claim.lastVisitedStep = 'performance-and-discipline'

    // Handle Save and come back later
    if (req.body.action === 'save') {
      claim.assignedTo = 'You (current user)'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    // 🔁 Handle return to check.html
    const returnUrl = req.body.returnUrl
    if (returnUrl) {
      return res.redirect(returnUrl)
    }

    // ➡️ Otherwise, continue to next step in the journey
    return saveAndRedirect(claim, req, res, 'timetabled-hours-during-term')
  })




  //////////////////////////////////////////////////////////////////////////////////
  

  // GET: Timetabled hours during term
  router.get('/provider/timetabled-hours-during-term/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    res.render('provider/timetabled-hours-during-term', {
      claim,
      returnUrl: req.query.returnUrl
    })
  })


  // POST: Timetabled hours during term
  router.post('/provider/timetabled-hours-during-term/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.timetabledHoursDuringTerm = req.body.timetabledHoursDuringTerm

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      claim.assignedTo = 'You (current user)'
      claim.lastVisitedStep = 'timetabled-hours-during-term'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    const returnUrl = req.body.returnUrl
    return res.redirect(`/provider/teaches-sixteen-to-nineteen/${claim.id}?returnUrl=${encodeURIComponent(returnUrl)}`)
  })



  //////////////////////////////////////////////////////////////////////////////////

  // GET: Teaches 16 to 19
  router.get('/provider/teaches-sixteen-to-nineteen/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    res.render('provider/teaches-sixteen-to-nineteen', {
      claim,
      returnUrl: req.query.returnUrl
    })
  })


  // POST: Teaches 16 to 19
  router.post('/provider/teaches-sixteen-to-nineteen/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.teachesSixteenToNineteen = req.body.teachesSixteenToNineteen

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      claim.assignedTo = 'You (current user)'
      claim.lastVisitedStep = 'teaches-sixteen-to-nineteen'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    const returnUrl = req.body.returnUrl
    if (returnUrl) {
      return res.redirect(returnUrl)
    }

    return saveAndRedirect(claim, req, res, 'level-three-confirm')
  })



  //////////////////////////////////////////////////////////////////////////////////


  // GET: Level 3 confirm
  router.get('/provider/level-three-confirm/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    res.render('provider/level-three-confirm', {
      claim,
      returnUrl: req.query.returnUrl
    })
  })


  // POST: Level 3 confirm
  router.post('/provider/level-three-confirm/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const teachesLevelThree = req.body.teachesLevelThree
    claim.teachesLevelThree = teachesLevelThree

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      claim.assignedTo = 'You (current user)'
      claim.lastVisitedStep = 'level-three-confirm'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    const returnUrl = req.body.returnUrl
    if (teachesLevelThree === 'Yes') {
      return res.redirect(`/provider/level-three-half-timetable-teaching-courses/${claim.id}?returnUrl=${encodeURIComponent(returnUrl)}`)
    }

    // If "No" – go to subject area
    return res.redirect(`/provider/level-three-subject-area/${claim.id}?returnUrl=${encodeURIComponent(returnUrl)}`)
  })



  //////////////////////////////////////////////////////////////////////////////////


  
  // GET: Level 3 half timetable teaching courses
  router.get('/provider/level-three-half-timetable-teaching-courses/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    res.render('provider/level-three-half-timetable-teaching-courses', {
      claim,
      returnUrl: req.query.returnUrl
    })
  })


  
  // POST: Level 3 half timetable teaching courses
  router.post('/provider/level-three-half-timetable-teaching-courses/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.levelThreeHalfTimetableTeachingCourses = req.body.levelThreeHalfTimetableTeachingCourses

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      claim.assignedTo = 'You (current user)'
      claim.lastVisitedStep = 'level-three-half-timetable-teaching-courses'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    const returnUrl = req.body.returnUrl
    if (returnUrl) {
      return res.redirect(returnUrl)
    }

    return saveAndRedirect(claim, req, res, 'check')
  })




  //////////////////////////////////////////////////////////////////////////////////


  // GET: Level 3 subject area
  router.get('/provider/level-three-subject-area/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    res.render('provider/level-three-subject-area', {
      claim,
      returnUrl: req.query.returnUrl
    })
  })


  // POST: Level 3 subject area
  router.post('/provider/level-three-subject-area/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    // Retrieve and normalise the submitted values
    let selected = req.body['levelThreeSubjectArea'] || req.body.levelThreeSubjectArea

    if (typeof selected === 'string') {
      selected = [selected]
    }

    if (!selected || !Array.isArray(selected)) {
      selected = []
    }

    // Remove artefacts like "_unchecked"
    selected = selected.filter(value => value && value !== '_unchecked')

    // Save to session data
    claim.levelThreeSubjectArea = selected

    // Handle save and come back later
    if (req.body.action === 'save') {
      claim.status = 'In progress'
      claim.assignedTo = 'You (current user)'
      claim.lastVisitedStep = 'level-three-subject-area'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    // 👇 Carry returnUrl forward to the next screen
    const returnUrl = req.body.returnUrl
    return res.redirect(`/provider/level-three-subject-area-courses/${claim.id}?returnUrl=${encodeURIComponent(returnUrl)}`)
  })




  //////////////////////////////////////////////////////////////////////////////////


  // GET: Level 3 subject area courses
  router.get('/provider/level-three-subject-area-courses/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    res.render('provider/level-three-subject-area-courses', {
      claim,
      returnUrl: req.query.returnUrl
    })
  })


 
// POST: Level 3 subject area courses
router.post('/provider/level-three-subject-area-courses/:claimId', (req, res) => {
  const claim = getClaim(req, res)
  if (!claim) return res.status(404).send('Claim not found')

  // Retrieve and normalise the submitted values
  let selected = req.body['levelThreeSubjectAreaCourses[]'] || req.body.levelThreeSubjectAreaCourses

  if (typeof selected === 'string') {
    selected = [selected]
  }

  if (!selected || !Array.isArray(selected)) {
    selected = []
  }

  // Remove artefacts like "_unchecked"
  selected = selected.filter(value => value && value !== '_unchecked')

  // Save to session data
  claim.levelThreeSubjectAreaCourses = selected

  // Handle save and come back later
  if (req.body.action === 'save') {
    claim.status = 'In progress'
    claim.assignedTo = 'You (current user)'
    claim.lastVisitedStep = 'level-three-subject-area-courses'
    return res.redirect(`/provider/save/${claim.id}`)
  }

  const returnUrl = req.body.returnUrl

  // ✅ Always return to check if coming from change link
  if (returnUrl) {
    return res.redirect(returnUrl)
  }

  // ✅ Otherwise (main journey), always go to check from this screen
  return saveAndRedirect(claim, req, res, 'check')
})







  //////////////////////////////////////////////////////////////////////////////////



// ==================================
// NEW: Multi-step fallback logic
// ==================================

const getNextIncompleteStep = (claim) => {
  if (!claim.teachingResponsibilities) {
    return 'member-of-staff'
  }

  if (!claim.first5Years || !claim.hasTeachingQualification) {
    return 'role-and-experience'
  }

  if (claim.hasTeachingQualification === 'No, but is planning to enrol on one' && !claim.qualificationMitigations) {
    return 'qualification-mitigations'
  }

  if (!claim.contractType) {
    return 'type-of-contract'
  }

  if (claim.contractType === 'Fixed-term' && !claim.fixedTermAcademicYear) {
    return 'fixed-term-contract-academic-year'
  }

  if (claim.contractType === 'Variable hours' && !claim.variableContractAcademicTerm) {
    return 'variable-contract-academic-term'
  }

  if (claim.contractType === 'Variable hours' && !claim.variableContractTimetabledHours) {
    return 'variable-contract-timetabled-hours-in-term'
  }

  if (!claim.performanceMeasures || !claim.subjectToDisciplinaryAction) {
    return 'performance-and-discipline'
  }

  if (!claim.timetabledHoursDuringTerm) {
    return 'timetabled-hours-during-term'
  }

  if (!claim.teachesSixteenToNineteen) {
    return 'teaches-sixteen-to-nineteen'
  }

  if (typeof claim.teachesLevelThree === 'undefined') {
    return 'level-three-confirm'
  }

  if (claim.teachesLevelThree === 'Yes' && !claim.levelThreeHalfTimetableTeachingCourses) {
    return 'level-three-half-timetable-teaching-courses'
  }

  if (claim.teachesLevelThree === 'No' && (!claim.levelThreeSubjectArea || claim.levelThreeSubjectArea.length === 0)) {
    return 'level-three-subject-area'
  }

  if (claim.teachesLevelThree === 'No' && (!claim.levelThreeSubjectAreaCourses || claim.levelThreeSubjectAreaCourses.length === 0)) {
    return 'level-three-subject-area-courses'
  }

  return 'check'
}



  // ================================
  // Developer utility: Reset all claims
  // ================================
  router.get('/reset', (req, res) => {
    req.session.data.claims = []
    res.redirect('/provider')
  })

// Route for returning users based on their progress
router.get('/provider/return/:claimId', (req, res) => {
  const claim = getClaim(req, res)
  if (!claim) return res.status(404).send('Claim not found')

  const nextStep = getNextIncompleteStep(claim)
  return res.redirect(`/provider/${nextStep}/${claim.id}`)
})



  

}



