module.exports = router => {

  // DfE sign in provider dashboard
  router.post('/p/dfe-sign-in', function (req, res){
    let data = req.session.data
    if (data.dfeSignInEmail == 'provider@example.com') {
      res.redirect('/provider');
    } else {
      res.redirect('/p/dfe-sign-in');
    }
  })
  

}