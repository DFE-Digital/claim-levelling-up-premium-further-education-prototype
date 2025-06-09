module.exports = router => {

  router.post('/one-login-returning-claimant/received-retention-incentive-before', (req, res) => {
    let data = req.session.data
    let receivedRetentionIncentive = data.receivedRetentionIncentive
    if (receivedRetentionIncentive === 'Yes') {
      ///this was previously /one-login-returning-claimant/one-login-sign-in-only
      res.redirect('/one-login-returning-claimant/do-you-have-a-one-login-account')
    } else{
      res.redirect('/one-login-returning-claimant/do-you-have-a-one-login-account')
    }
  })

  router.post('/one-login-returning-claimant/do-you-have-a-one-login-account', (req, res) => {
    let data = req.session.data
    let hasOneLoginAccount = data.hasOneLoginAccount
    if (hasOneLoginAccount === 'Yes' ||  hasOneLoginAccount === "I don't know") {
      res.redirect('/one-login-returning-claimant/one-login-sign-in-only')
    } else {
      res.redirect('/start')
    }
  })

  router.post('/one-login-returning-claimant/one-login-sign-in-only', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-returning-claimant/one-login-email')
    
  })

  router.post('/one-login-returning-claimant/one-login-email', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-returning-claimant/one-login-password')
    
  })

  router.post('/one-login-returning-claimant/one-login-password', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-returning-claimant/one-login-one-time-passcode')
    
  })
  router.post('/one-login-returning-claimant/one-login-one-time-passcode', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-returning-claimant/one-login-signed-in')
    
  })

  router.post('/one-login-returning-claimant/one-login-signed-in', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-returning-claimant/find-another-way')
    
  })

  router.post('/one-login-returning-claimant/find-another-way', (req, res) => {
    let data = req.session.data
    if (data.findAnotherWay === "continue") {
       res.redirect('/one-login-returning-claimant/confirm-college')   
    } else {
      res.redirect('https://govuk-one-login-prototype-6d2545e2d700.herokuapp.com/page-index/authentication/create-account')  
    } 
  })

  router.post('/one-login-returning-claimant/confirm-college', (req, res) => {
    let data = req.session.data
    if (data.hasWorkEmail === "Yes") {
      res.redirect('/one-login-returning-claimant/work-email')
      
    } else {
      
    }
    res.redirect('/one-login-returning-claimant/signed-you-out')
    
  })

  router.post('/one-login-returning-claimant/work-email', (req, res) => {
    let data = req.session.data
    res.redirect('/one-login-returning-claimant/six-digit-passcode') 
  })

  router.post('/one-login-returning-claimant/six-digit-passcode', (req, res) => {
    let data = req.session.data
    res.redirect('/one-login-returning-claimant/how-we-will-use-your-information') 
  })

  router.post('/one-login-returning-claimant/how-we-will-use-your-information', (req, res) => {
    let data = req.session.data
    res.redirect('/one-login-returning-claimant/personal-details') 
  })

    router.post('/one-login-returning-claimant/personal-details', (req, res) => {
    let data = req.session.data
    res.redirect('/one-login-returning-claimant/personal-bank-details') 
  })
}