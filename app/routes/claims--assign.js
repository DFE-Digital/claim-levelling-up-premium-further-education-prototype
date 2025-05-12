module.exports = router => {

  router.get('/provider/:claimId/assign', (req, res) => {
    let claims = req.session.data.claims || []
    let claim = claims.find(claim => String(claim.id) === req.params.claimId)
  
    res.render('provider/assign/index', { claim })
  })


  router.post('/provider/:claimId/assign', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
    
    claim.status = 'In progress'
    claim.assignedTo = '[Name of person processing claim]'
    claim.dateSubmitted = '[Date assign button is clicked]'

    res.redirect(`/provider/show/${claim.id}`)
    
  })

}