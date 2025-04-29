module.exports = router => {

  router.get('/provider/completed', (req, res) => {
    const claims = req.session.data.claims || []
  
    // Filter to only claims that are complete
    const completedClaims = claims.filter(claim => claim.status === 'Complete')
  
    res.render('provider/completed/index', {
      claims: completedClaims
    })
  })

}