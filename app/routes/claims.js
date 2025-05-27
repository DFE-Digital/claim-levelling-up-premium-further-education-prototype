const { govukDate } = require('@x-govuk/govuk-prototype-filters')

const Pagination = require('../helpers/pagination')


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
  const getClaim = (req, res) => {
    const claims = req.session.data.claims || []
    return claims.find(claim => String(claim.id) === req.params.claimId)
  }

   // ================================
  // PROVIDER DASHBOARD
  // ================================

  // GET: Active claims (Not started / In progress)
  router.get('/provider', (req, res) => {
    let allClaims = req.session.data.claims || []

    let activeClaims = allClaims.filter(claim =>
      claim.status === 'Not started' || claim.status === 'In progress'
    )

    let pageSize = 10
    let pagination = new Pagination(activeClaims, req.query.page, pageSize)
    let claims = pagination.getData()

    console.log('All claims:', allClaims)
    console.log('Active claims:', activeClaims)

    res.render('provider/index', {
      claims,
      pagination
    })
  })

  // POST: Mark claim as Verified (from check screen)
  router.post('/provider/index/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    const now = new Date()

    claim.status = 'Verified'
    claim.assignedTo = '[Name_of_verifier]'
    claim.assignedDate = now.toISOString()
    claim.dateVerified = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    claim.dateVerifiedIso = now.toISOString().split('T')[0]


    req.flash('success', `Claim verified <a class="govuk-link" href="/provider/completed/show/${claim.id}"><br>View verified claim</a>`)
    res.redirect('/provider')
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

  // POST: Save radio responses (Continue or Save and come back)
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
      req.flash('success', 'Your answers have been saved. You can come back and complete them later.')
      return res.redirect(`/provider/save/${claim.id}`)
    }
  
    // Branch based on contract type
    const contractType = claim.contractType
  
    if (contractType === 'Permanent') {
      return res.redirect(`/provider/performance-and-discipline/${claim.id}`)
    }
  
    if (contractType === 'Fixed-term') {
      return res.redirect(`/provider/contract-academic-year/${claim.id}`)
    }
  
    if (contractType === 'Variable hours') {
      return res.redirect(`/provider/hours-academic-year/${claim.id}`)
    }
  
    // Fallback (missing or invalid selection)
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
  
    res.redirect(`/provider/role-and-experience/${claim.id}`)
  })

  /////confirm FINISH VERIFICATION
  router.post('/provider/confirm-finish-verifier/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
  
    if (!claim) return res.status(404).send('Claim not found')
  
    const userChoice = req.body.continueVerification
  
    if (userChoice === 'Yes') {
      // Assign to current user
      claim.assignedTo = 'Me - [current_user]'
      claim.status = 'In progress'
      claim.assignedDate = new Date().toISOString()
  
      // Return to the screen they left
      const step = claim.lastVisitedStep || 'role-and-experience'
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

  router.get('/provider/role-and-experience/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
  
    const returnUrl = req.query.returnUrl
    res.render('provider/role-and-experience', { claim, returnUrl })
  })

  // Role and experience
  router.post('/provider/role-and-experience/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
  
    const returnUrl = req.query.returnUrl
  
    // ✅ Validate required input
    if (!req.body.completedSection) {
      const errors = [{
        text: 'Select whether you have completed this section',
        href: '#completedSection'
      }]
      return res.render('provider/role-and-experience', {
        claim,
        errors,
        returnUrl // 👈 ensures it’s passed back to the template
      })
    }
  
    // ✅ Save submitted answers
    claim.teachingResponsibilities = req.body.teachingResponsibilities
    claim.first5Years = req.body.first5Years
    claim.hasTeachingQualification = req.body.hasTeachingQualification
    claim.contractType = req.body.contractType
    claim.status = 'In progress'
    claim.lastVisitedStep = 'role-and-experience'
  
    // ✅ Save and pause
    if (req.body.completedSection === 'No') {
      return res.redirect(`/provider/save/${claim.id}`)
    }
  
    // ✅ Fixed-term requires next screen first
    if (claim.contractType === 'Fixed-term') {
      if (returnUrl) {
        return res.redirect(`/provider/contract-academic-year/${claim.id}?returnUrl=${encodeURIComponent(returnUrl)}`)
      }
      return saveAndRedirect(claim, req, res, 'contract-academic-year')
    }
  
    // ✅ Variable hours requires next screen first
    if (claim.contractType === 'Variable hours') {
      if (returnUrl) {
        return res.redirect(`/provider/hours-academic-year/${claim.id}?returnUrl=${encodeURIComponent(returnUrl)}`)
      }
      return saveAndRedirect(claim, req, res, 'hours-academic-year')
    }
  
    // ✅ Permanent — go directly back to check if returnUrl present
    if (returnUrl) {
      return res.redirect(returnUrl)
    }
  
    return saveAndRedirect(claim, req, res, 'performance-and-discipline')
  })
  
  
  

  // Contract academic year
  router.get('/provider/contract-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
    res.render('provider/contract-academic-year', { 
      claim,
      returnUrl: req.query.returnUrl // 👈 make this available to your template
    })
  })

  router.post('/provider/contract-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
  
    const returnUrl = req.query.returnUrl
    const completed = req.body.completedSection
  
    claim.contractAcademicYear = req.body.contractAcademicYear 
    claim.status = 'In progress'
    claim.lastVisitedStep = 'contract-academic-year'
  
    if (completed === 'No') {
      return res.redirect(`/provider/save/${claim.id}`)
    }
  
    // ✅ Use helper which will return to check if returnUrl is present
    return saveAndRedirect(claim, req, res, 'performance-and-discipline')
  })
  
  
  

  /////////////// Hours academic year
  router.get('/provider/hours-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
    res.render('provider/hours-academic-year', { 
      claim,
      returnUrl: req.query.returnUrl // 👈 make this available to your template
     })
  })



  router.post('/provider/hours-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
  
    const returnUrl = req.query.returnUrl
    const completed = req.body.completedSection
  
    claim.hoursAcademicYear = req.body.hoursAcademicYear
    claim.status = 'In progress'
    claim.lastVisitedStep = 'hours-academic-year'
  
    if (completed === 'No') {
      return res.redirect(`/provider/save/${claim.id}`)
    }
  
    // ✅ Use helper which will return to check if returnUrl is present
    return saveAndRedirect(claim, req, res, 'performance-and-discipline')
  })
  
  
  
  

  // Performance and discipline
  router.get('/provider/performance-and-discipline/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
    res.render('provider/performance-and-discipline', { 
      claim,
      returnUrl: req.query.returnUrl // 👈 make this available to your template
     })
  })



// ==================================
// NEW: Multi-step fallback logic
// ==================================

const getNextIncompleteStep = (claim) => {
  if (!claim.teachingResponsibilities || !claim.first5Years || !claim.hasTeachingQualification || !claim.contractType) {
    return 'role-and-experience'
  }
  if (claim.contractType === 'Fixed-term' && !claim.contractAcademicYear) {
    return 'contract-academic-year'
  }
  if (claim.contractType === 'Variable hours' && !claim.hoursAcademicYear) {
    return 'hours-academic-year'
  }
  if (!claim.performanceMeasures || !claim.subjectToDisciplinaryAction) {
    return 'performance-and-discipline'
  }
  if (!claim.contractedHours || !claim.sixteenToNineteen || !claim.fundingAtLevelThreeAndBelow) {
    return 'contracted-hours'
  }
  return 'check'
}

// Route for returning users based on their progress
router.get('/provider/return/:claimId', (req, res) => {
  const claim = getClaim(req, res)
  if (!claim) return res.status(404).send('Claim not found')

  const nextStep = getNextIncompleteStep(claim)
  return res.redirect(`/provider/${nextStep}/${claim.id}`)
})



router.post('/provider/performance-and-discipline/:claimId', (req, res) => {
  const claim = getClaim(req, res)
  if (!claim) return res.status(404).send('Claim not found')

  claim.performanceMeasures = req.body.performanceMeasures
  claim.subjectToDisciplinaryAction = req.body.subjectToDisciplinaryAction
  claim.status = 'In progress'
  claim.lastVisitedStep = 'performance-and-discipline'

  if (req.body.completedSection === 'No') {
    return res.redirect(`/provider/save/${claim.id}`)
  }

  return saveAndRedirect(claim, req, res, 'contracted-hours')
})

  // Contracted hours
  router.get('/provider/contracted-hours/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
  
    res.render('provider/contracted-hours', {
      claim,
      returnUrl: req.query.returnUrl // 👈 make this available to your template
    })
  })
  

  router.post('/provider/contracted-hours/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
  
    const returnUrl = req.query.returnUrl // ✅ Ensure this is captured early
  
    if (!req.body.completedSection) {
      const errors = [{
        text: 'Select whether you have completed this section',
        href: '#completedSection'
      }]
      return res.render('provider/contracted-hours', {
        claim,
        errors,
        returnUrl // ✅ Make sure this is passed back into the template
      })
    }
  
    claim.contractedHours = req.body.contractedHours
    claim.sixteenToNineteen = req.body.sixteenToNineteen
    claim.fundingAtLevelThreeAndBelow = req.body.fundingAtLevelThreeAndBelow
    claim.status = 'In progress'
    claim.lastVisitedStep = 'contracted-hours'
  
    if (req.body.completedSection === 'No') {
      return res.redirect(`/provider/save/${claim.id}`)
    }
  
    // ✅ Use saveAndRedirect which handles returnUrl fallback
    return saveAndRedirect(claim, req, res, 'check')
  })
  

}



