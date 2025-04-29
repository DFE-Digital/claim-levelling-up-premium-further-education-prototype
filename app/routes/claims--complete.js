const Pagination = require('../helpers/pagination')

module.exports = router => {

  // router.get('/provider/completed', (req, res) => {
  //   const claims = req.session.data.claims || []

  //   const completedClaims = claims.filter(claim => claim.status === 'Complete')
    
  //   let pageSize = 10
  //   let pagination = new Pagination(completedClaims, req.query.page, pageSize)
  //   const paginatedClaims = pagination.getData()
    
  //   res.render('provider/completed/index', {
  //     claims: paginatedClaims,
  //     pagination
  //   })
  // })

  router.get('/provider/completed/show/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    res.render('provider/completed/show', { claim })
  })

  /////////////////////////////////////////////////////////////////////////


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

      // Check if all required fields are 'yes'
      claim.verified = (
        claim.permanentContract === 'yes' &&
        claim.teachingResponsibilities === 'yes' &&
        claim.first5Years === 'yes' &&
        claim.twelveHoursPerWeek === 'yes' &&
        claim.sixteenToNineteen === 'yes' &&
        claim.fundingAtLevelThreeAndBelow === 'yes' &&
        claim.performanceMeasures === 'yes' &&
        claim.subjectToDisciplinaryAction === 'yes'
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