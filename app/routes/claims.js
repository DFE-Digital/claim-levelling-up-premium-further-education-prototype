const { govukDate } = require('@x-govuk/govuk-prototype-filters')

const Pagination = require('../helpers/pagination')


// Combined claims.js with multi-step verification flow
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

    claim.verifier = whoWillVerify
    claim.status = 'Not started'
    claim.assignedTo = whoWillVerify === 'Me' ? 'You' : whoWillVerify
    claim.assignedDate = new Date().toISOString()

    ////FLASH MSG
    req.flash('success', 'Claim assigned to <strong>' + claim.assignedTo + '</strong> on <span class="govuk-!-font-weight-bold">' + govukDate(claim.assignedDate) + '</span>')


    if (whoWillVerify === 'Me') {
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

  // GET: Final verification confirmation screen
  router.get('/provider/finish-verifying/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    res.render('provider/finish-verifying', { claim })
  })

  // POST: if Yes go to SHOW.HTML
  router.post('/provider/confirm-verifier/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(claim => String(claim.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    const userChoice = req.body.continueVerification
  
    if (userChoice === 'Yes') {
      return res.redirect(`/provider/role-and-experience/${claim.id}`)
    }
  
    // User selected "No"
    if (claim.status === 'In progress') {
      req.flash('success', 'Claim: read only mode')
      return res.redirect(`/provider/read-only/${claim.id}`)
    }
  
    if (claim.status === 'Not started') {
      req.flash('success', 'This claim has not been started yet')
      return res.redirect(`/provider/finish-verifying/${claim.id}`)
    }
  
    // Fallback
    return res.redirect('/provider')
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

  // Role and experience
  router.get('/provider/role-and-experience/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
    res.render('provider/role-and-experience', { claim })
  })

  router.post('/provider/role-and-experience/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.contractType = req.body.contractType

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    if (claim.contractType === 'Permanent') {
      return res.redirect(`/provider/performance-and-discipline/${claim.id}`)
    } else if (claim.contractType === 'Fixed term') {
      return res.redirect(`/provider/contract-academic-year/${claim.id}`)
    } else if (claim.contractType === 'Variable hours') {
      return res.redirect(`/provider/hours-academic-year/${claim.id}`)
    } else {
      return res.redirect(`/provider/role-and-experience/${claim.id}`)
    }
  })

  // Contract academic year
  router.get('/provider/contract-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
    res.render('provider/contract-academic-year', { claim })
  })

  router.post('/provider/contract-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.contractAcademicYear = req.body.contractAcademicYear

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    res.redirect(`/provider/performance-and-discipline/${claim.id}`)
  })

  // Hours academic year
  router.get('/provider/hours-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
    res.render('provider/hours-academic-year', { claim })
  })

  router.post('/provider/hours-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.hoursAcademicYear = req.body.hoursAcademicYear

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    res.redirect(`/provider/performance-and-discipline/${claim.id}`)
  })

  // Performance and discipline
  router.get('/provider/performance-and-discipline/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
    res.render('provider/performance-and-discipline', { claim })
  })

  router.post('/provider/performance-and-discipline/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.performanceMeasures = req.body.performanceMeasures
    claim.subjectToDisciplinaryAction = req.body.subjectToDisciplinaryAction

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    res.redirect(`/provider/contracted-hours/${claim.id}`)
  })

  // Contracted hours
  router.get('/provider/contracted-hours/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
    res.render('provider/contracted-hours', { claim })
  })

  router.post('/provider/contracted-hours/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.contractedHours = req.body.contractedHours

    if (req.body.action === 'save') {
      claim.status = 'In progress'
      return res.redirect(`/provider/save/${claim.id}`)
    }

    res.redirect(`/provider/check/${claim.id}`)
  })
}
