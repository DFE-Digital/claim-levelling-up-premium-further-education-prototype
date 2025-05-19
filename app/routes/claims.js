const Pagination = require('../helpers/pagination')

module.exports = router => {

  router.get('/provider', (req, res) => {
    let allClaims = req.session.data.claims || []
  
    // Filter to only "Not started" and "In progress" claims
    let activeClaims = allClaims.filter(claim =>
      claim.status === 'Not started' || claim.status === 'In progress'
    )
  
    let pageSize = 10
    let pagination = new Pagination(activeClaims, req.query.page, pageSize)
    let claims = pagination.getData()
  
    res.render('provider/index', { 
      claims,
      pagination
    })
  })

  //GET --> WHO-WILL-VERIFY
  router.get('/provider/who-will-verify/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    res.render('provider/who-will-verify', { claim })
  })

  ////////// POST WHO-WILL-VERIFY (ASSIGNED TO)
  router.post('/provider/who-will-verify/:claimId', (req, res) => {
    const claimId = req.params.claimId
    const whoWillVerify = req.body.whoWillVerify
    const claims = req.session.data.claims || []
  
    const claim = claims.find(claim => String(claim.id) === claimId)
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    // Persist data
    claim.verifier = whoWillVerify
    claim.status = 'Not started'
    claim.assignedTo = whoWillVerify === 'Me' ? 'You' : whoWillVerify
    claim.assignedDate = new Date().toISOString()
  
    // Set flash message
    req.flash('success', `Claim assigned to <strong>${claim.assignedTo}</strong> on <span class="govuk-!-font-weight-bold">${new Date(claim.assignedDate).toLocaleDateString()}</span>`)
  
    // Redirect based on who will verify
    if (whoWillVerify === 'Me') {
      return res.redirect(`/provider/show/${claimId}`)
    } else {
      return res.redirect('/provider')
    }
  })
  

  //Handles the link to finish-verify.html
  router.get('/provider/finish-verifying/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    res.render('provider/finish-verifying', { claim })
  })
  


  //Handles the link to show.html
  router.get('/provider/show/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    res.render('provider/show', { claim })
  })

   //Handles the link to verified.html
   router.get('/provider/verified/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    res.render('provider/verified', { claim })
  })

  //Handles the radios on show.html
  router.post('/provider/check/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
    


    //  Save radio answers into the claim
    claim.permanentContract = req.body.permanentContract
    claim.teachingResponsibilities = req.body.teachingResponsibilities
    claim.first5Years = req.body.first5Years
    claim.twelveHoursPerWeek = req.body.twelveHoursPerWeek
    claim.sixteenToNineteen = req.body.sixteenToNineteen
    claim.fundingAtLevelThreeAndBelow = req.body.fundingAtLevelThreeAndBelow
    claim.performanceMeasures = req.body.performanceMeasures
    claim.subjectToDisciplinaryAction = req.body.subjectToDisciplinaryAction

    res.redirect(`/provider/check/${req.params.claimId}`)
  })



  router.get('/provider/check/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    res.render('provider/check', { claim })
  })
  
  //Post back to index and change status to Complete
  router.post('/provider/index/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    claim.status = 'Verified'
    claim.assignedTo = '[Name_of_verifier]'
    claim.assignedDate = new Date().toISOString()
  
    // Set a flash message with HTML (text + link)
    req.flash('success', `Claim verified <a class="govuk-link" href="/provider/completed/check/${claim.id}"><br>View verified claim</a>`)
    res.redirect('/provider')
  })


}