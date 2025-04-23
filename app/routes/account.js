module.exports = router => {

  // DfE sign in provider dashboard
  router.post('/account/dfe-sign-in', function (req, res){
    req.session.data.user =  {}
    let data = req.session.data
    if (data.dfeSignInEmail == 'provider@example.com') {
      res.redirect('/provider');
    } else {
      res.redirect('/account/dfe-sign-in');
    }
  })
  

}