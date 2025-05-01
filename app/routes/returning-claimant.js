module.exports = router => {

  router.post('/claimant/received-retention-incentive-before', (req, res) => {
    let data = req.session.data
    let receivedRetentionIncentive = data.receivedRetentionIncentive
    if (receivedRetentionIncentive === 'Yes') {
      res.redirect('/claimant/one-login-start')
    } else{
      res.redirect('/claimant/do-you-have-a-one-login-account')
    }
  })

  router.post('/claimant/do-you-have-a-one-login-account', (req, res) => {
    let data = req.session.data
    let hasOneLoginAccount = data.hasOneLoginAccounts
    if (hasOneLoginAccount === 'Yes') {
      res.redirect('/claimant/one-login-start')
    } else{
      res.redirect('/start')
    }
  })
}