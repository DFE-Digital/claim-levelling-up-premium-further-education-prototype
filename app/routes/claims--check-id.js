function getClaim(req, res) {
  const claims = req.session.data.claims || []
  return claims.find(claim => String(claim.id) === req.params.claimId)
}


module.exports = router => {

  // GET: Check identity screen for 'Check required' claims
  router.get('/provider/check-identity/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(claim => String(claim.id) === req.params.claimId)

    if (!claim) return res.status(404).send('Claim not found')

    res.render('provider/check-identity/index', {
      claim,
      data: req.session.data,
      fieldErrors: {}
    })
  })

  // POST: Check claimant identity screen
  router.post('/provider/check-identity/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const data = req.body
    const sessionData = req.session.data

    // Save each form field to the session
    sessionData.isClaimantKnownToYou = data.isClaimantKnownToYou
    sessionData["returnClaimantDob-day"] = data["returnClaimantDob-day"]
    sessionData["returnClaimantDob-month"] = data["returnClaimantDob-month"]
    sessionData["returnClaimantDob-year"] = data["returnClaimantDob-year"]
    sessionData.returnClaimantDob = {
      day: data["returnClaimantDob-day"],
      month: data["returnClaimantDob-month"],
      year: data["returnClaimantDob-year"]
    }
    sessionData.returnClaimantPostcode = data.returnClaimantPostcode
    sessionData.returnClaimantNationalInsuranceNumber = data.returnClaimantNationalInsuranceNumber
    sessionData.claimantBankDetailsMatch = data.claimantBankDetailsMatch
    sessionData.claimantWorkEmail = data.claimantWorkEmail // this is the email field

    // Store status change
    claim.status = "Check required"
    claim.assignedTo = "Unassigned"

    res.redirect(`/provider/check-identity/check/${claim.id}`)
  })


router.get('/provider/check-identity/check/:claimId', (req, res) => {
  const claim = getClaim(req, res)
  if (!claim) return res.status(404).send('Claim not found')

  const dobDay = req.session.data["returnClaimantDob-day"]
  const dobMonth = req.session.data["returnClaimantDob-month"]
  const dobYear = req.session.data["returnClaimantDob-year"]

  const monthNames = {
    "1": "January", "01": "January",
    "2": "February", "02": "February",
    "3": "March", "03": "March",
    "4": "April", "04": "April",
    "5": "May", "05": "May",
    "6": "June", "06": "June",
    "7": "July", "07": "July",
    "8": "August", "08": "August",
    "9": "September", "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
  }

  const formattedDob = `${dobDay} ${monthNames[dobMonth] || dobMonth} ${dobYear}`

  res.render('provider/check-identity/check', {
    claim,
    data: req.session.data,
    formattedDob
  })
})


   // POST: Final submit from Check your answers screen
  router.post('/provider/check-identity/check/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    // Update claim status and clear assignment
    claim.status = 'Not started'
    claim.assignedTo = 'Unassigned'

    // Flash message
    req.flash('success', `Additional information for <strong>${claim.claimantName}</strong> submitted`)

    res.redirect('/provider')
  })


}