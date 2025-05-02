module.exports = router => {

  router.post('/claimant/received-retention-incentive-before', (req, res) => {
    let data = req.session.data
    let receivedRetentionIncentive = data.receivedRetentionIncentive
    if (receivedRetentionIncentive === 'Yes') {
      res.redirect('/claimant/one-login-sign-in-only')
    } else{
      res.redirect('/claimant/do-you-have-a-one-login-account')
    }
  })

  router.post('/claimant/do-you-have-a-one-login-account', (req, res) => {
    let data = req.session.data
    let hasOneLoginAccount = data.hasOneLoginAccount
    if (hasOneLoginAccount === 'Yes' ||  hasOneLoginAccount === "I don't know") {
      res.redirect('/claimant/one-login-sign-in-only')
    } else {
      res.redirect('/start')
    }
  })

  router.post('/claimant/one-login-sign-in-only', (req, res) => {
    let data = req.session.data
    
    res.redirect('/claimant/one-login-email')
    
  })

  router.post('/claimant/one-login-email', (req, res) => {
    let data = req.session.data
    
    res.redirect('/claimant/one-login-password')
    
  })

  router.post('/claimant/one-login-password', (req, res) => {
    let data = req.session.data
    
    res.redirect('/claimant/one-login-one-time-passcode')
    
  })
  router.post('/claimant/one-login-one-time-passcode', (req, res) => {
    let data = req.session.data
    
    res.redirect('/claimant/one-login-signed-in')
    
  })

  router.post('/claimant/one-login-signed-in', (req, res) => {
    let data = req.session.data
    
    res.redirect('/start')
    
  })
}