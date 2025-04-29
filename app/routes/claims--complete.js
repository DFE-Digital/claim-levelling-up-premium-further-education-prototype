const Pagination = require('../helpers/pagination')

module.exports = router => {

  router.get('/provider/completed', (req, res) => {
    const claims = req.session.data.claims || []

    const completedClaims = claims.filter(claim => claim.status === 'Complete')
    
    let pageSize = 10
    let pagination = new Pagination(completedClaims, req.query.page, pageSize)
    const paginatedClaims = pagination.getData()
    
    res.render('provider/completed/index', {
      claims: paginatedClaims,
      pagination
    })
  })

  router.get('/provider/completed/show/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    res.render('provider/completed/show', { claim })
  })
  

}