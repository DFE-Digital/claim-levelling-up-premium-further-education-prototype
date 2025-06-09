module.exports = router => {

  router.post('/one-login-retunrning-claimant/received-retention-incentive-before', (req, res) => {
    let data = req.session.data
    let receivedRetentionIncentive = data.receivedRetentionIncentive
    if (receivedRetentionIncentive === 'Yes') {
      ///this was previously /one-login-retunrning-claimant/one-login-sign-in-only
      res.redirect('/one-login-retunrning-claimant/do-you-have-a-one-login-account')
    } else{
      res.redirect('/one-login-retunrning-claimant/do-you-have-a-one-login-account')
    }
  })

  router.post('/one-login-retunrning-claimant/do-you-have-a-one-login-account', (req, res) => {
    let data = req.session.data
    let hasOneLoginAccount = data.hasOneLoginAccount
    if (hasOneLoginAccount === 'Yes' ||  hasOneLoginAccount === "I don't know") {
      res.redirect('/one-login-retunrning-claimant/one-login-sign-in-only')
    } else {
      res.redirect('/start')
    }
  })

  router.post('/one-login-retunrning-claimant/one-login-sign-in-only', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-retunrning-claimant/one-login-email')
    
  })

  router.post('/one-login-retunrning-claimant/one-login-email', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-retunrning-claimant/one-login-password')
    
  })

  router.post('/one-login-retunrning-claimant/one-login-password', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-retunrning-claimant/one-login-one-time-passcode')
    
  })
  router.post('/one-login-retunrning-claimant/one-login-one-time-passcode', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-retunrning-claimant/one-login-signed-in')
    
  })

  router.post('/one-login-retunrning-claimant/one-login-signed-in', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-retunrning-claimant/find-another-way')
    
  })

  router.post('/one-login-retunrning-claimant/find-another-way', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-retunrning-claimant/confirm-college')
    
  })
}