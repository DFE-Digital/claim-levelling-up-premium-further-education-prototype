module.exports = router => {

  router.get('/provider/:claimId/check', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)
  
    res.render('provider/index', { claim })
  })


  router.post('/provider/:claimId/check', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
    
    claim.status = 'Complete'
    claim.assignedTo = 'Tom Brown'
    claim.assignedDate = new Date().toISOString()

    res.redirect(`/provider/${claim.id}`)
    
  })

}