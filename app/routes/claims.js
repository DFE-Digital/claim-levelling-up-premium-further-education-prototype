const Pagination = require('../helpers/pagination')

module.exports = router => {

  //Handles pagination
  router.get('/provider', (req, res) => {
    let claims = req.session.data.claims || []
    
    
    let pageSize = 10
    let pagination = new Pagination(claims, req.query.page, pageSize)
    claims = pagination.getData()

    res.render('provider/index', { 
      claims,
      pagination
    })
  })



  router.get('/provider/show/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    res.render('provider/show', { claim })
  })

   // Handle completing the claim
  router.post('/provider/check/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    const selectedIssues = req.body.incorrect


    // Save checkboxes on show.html to session
    req.session.data.incorrect = Array.isArray(selectedIssues)
    ? selectedIssues             // Already an array, leave it as is
    : selectedIssues
    ? [selectedIssues]           // Single string — wrap it in an array
    : []                         // Nothing selected — fallback to an empty array

    claim.status = 'Complete'
    claim.assignedTo = 'Tom Brown'
    claim.assignedDate = new Date().toISOString()

    res.redirect(`/provider/check/${req.params.claimId}`)
  })
  

  router.get('/provider/check/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    res.render('provider/check', { claim })
  })

}