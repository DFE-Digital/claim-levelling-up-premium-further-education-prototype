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

  //Handles the checkboxes on show.html
  router.post('/provider/check/:claimId', (req, res) => {
    const selectedIssues = req.body.incorrect

    // Save checkboxes on show.html to session
    req.session.data.incorrect = Array.isArray(selectedIssues)
    ? selectedIssues             // Already an array, leave it as is
    : selectedIssues
    ? [selectedIssues]           // Single string — wrap it in an array
    : []                         // Nothing selected — fallback to an empty array

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
    
    claim.status = 'Complete'
    claim.assignedTo = 'Tom Brown'
    claim.assignedDate = new Date().toISOString()

    res.redirect('/provider')
    // res.redirect(`/provider/${claim.id}`)
    
  })
 
  
  


}