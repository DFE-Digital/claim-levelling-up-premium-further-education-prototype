const Pagination = require('../helpers/pagination')

module.exports = router => {

  router.get('/provider/completed', (req, res) => {
    let allClaims = req.session.data.claims || []
  
    // Only get Verified claims
    let verifiedClaims = allClaims.filter(claim => claim.status === 'Verified')
  
    // Apply pagination to the filtered list
    let pageSize = 10
    let pagination = new Pagination(verifiedClaims, req.query.page, pageSize)
    let claims = pagination.getData()
  
    res.render('provider/completed/index', { 
      claims,
      pagination
    })
  })


  // GET: Update a verified claim
  router.get('/provider/completed/show/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    if (claim.status !== 'Verified') {
      return res.status(400).send('Only verified claims can be updated from this page.')
    }

    res.render('provider/completed/show', { claim })
  })

  /////////////////////////////////////////////////////////////////////////

  router.post('/provider/completed/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
   // Set a flash message with HTML (text + link)
   req.flash('success', `Claim Verified <a class="govuk-link" href="/provider/completed/check/${claim.id}"><br>View Verified claim</a>`)
  
    res.redirect('/provider/completed')
  })



  router.get('/provider/completed', (req, res) => {
    const claims = req.session.data.claims || []

    // 1. Filter claims that are marked as 'Complete'
    const completedClaims = claims.filter(claim => claim.status === 'Complete')


    // 2. Add 'verified' flag to each completed claim
    completedClaims.forEach(claim => {

      console.log('Claim fields:', {
        permanentContract: claim.permanentContract,
        teachingResponsibilities: claim.teachingResponsibilities,
        first5Years: claim.first5Years,
        twelveHoursPerWeek: claim.twelveHoursPerWeek,
        sixteenToNineteen: claim.sixteenToNineteen,
        fundingAtLevelThreeAndBelow: claim.fundingAtLevelThreeAndBelow,
        performanceMeasures: claim.performanceMeasures,
        subjectToDisciplinaryAction: claim.subjectToDisciplinaryAction
      })

      // Check if all required fields are 'yes' NEED TO CHANGE LAST TWO TO NO for NIGELS NEW IDEA
      claim.verified = (
        claim.permanentContract === 'yes' &&
        claim.teachingResponsibilities === 'yes' &&
        claim.first5Years === 'yes' &&
        claim.twelveHoursPerWeek === 'yes' &&
        claim.sixteenToNineteen === 'yes' &&
        claim.fundingAtLevelThreeAndBelow === 'yes' &&
        claim.performanceMeasures === 'no' &&
        claim.subjectToDisciplinaryAction === 'no'
      )
    })

    // 3. Paginate AFTER setting verified flags
    const pageSize = 10
    const pagination = new Pagination(completedClaims, req.query.page, pageSize)
    const paginatedClaims = pagination.getData()

    // 4. Render the template with paginated verified claims
    res.render('provider/completed/index', {
      claims: paginatedClaims,
      pagination
    })
  })
  

}