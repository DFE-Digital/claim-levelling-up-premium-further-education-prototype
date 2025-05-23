const { govukDate } = require('@x-govuk/govuk-prototype-filters')

const Pagination = require('../helpers/pagination')

module.exports = router => {

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
      return res.redirect(`/provider/show/${claimId}`)
    } else {
      return res.redirect('/provider')
    }
  })


  // ================================
  // SHOW CLAIM (Review and verification steps)
  // ================================

  // GET: Show claim and verification questions
  router.get('/provider/show/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    res.render('provider/show', { claim })
  })

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

    // Save values
    claim.permanentContract = req.body.permanentContract
    claim.teachingResponsibilities = req.body.teachingResponsibilities
    claim.first5Years = req.body.first5Years
    claim.twelveHoursPerWeek = req.body.twelveHoursPerWeek
    claim.sixteenToNineteen = req.body.sixteenToNineteen
    claim.fundingAtLevelThreeAndBelow = req.body.fundingAtLevelThreeAndBelow
    claim.performanceMeasures = req.body.performanceMeasures
    claim.subjectToDisciplinaryAction = req.body.subjectToDisciplinaryAction

    const isSaveAndComeBack = req.body.action === 'save'

    if (isSaveAndComeBack) {
      claim.status = 'In progress'
      claim.assignedTo = '[claims_team_verifyer]'
      req.flash('success', 'Your answers have been saved. You can come back and complete them later.')
      return res.redirect(`/provider/save/${req.params.claimId}`)
    }

    const allAnswered = [
      claim.status = 'In progress',
      claim.permanentContract,
      claim.teachingResponsibilities,
      claim.first5Years,
      claim.twelveHoursPerWeek,
      claim.sixteenToNineteen,
      claim.fundingAtLevelThreeAndBelow,
      claim.performanceMeasures,
      claim.subjectToDisciplinaryAction
    ].every(answer => answer === 'yes' || answer === 'no')

    if (!allAnswered) {
      req.flash('error', 'You must answer all questions to continue')
      return res.redirect(`/provider/check/${req.params.claimId}`)
    }

    res.redirect(`/provider/check/${req.params.claimId}`)
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
      return res.redirect(`/provider/show/${claim.id}`)
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

}
