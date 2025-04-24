module.exports = router => {

  router.get('/provider/:claimId', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    res.render('provider/show', { claim })
  })


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
  

 
  
  


}