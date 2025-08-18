function getClaim(req, res) {
  const claims = req.session.data.claims || []
  return claims.find(claim => String(claim.id) === req.params.claimId)
}


module.exports = router => {

 // 1. GET: "Further information is required on this claim" screen
  router.get('/provider/check-identity/:claimId', function (req, res) {
    const claimId = req.params.claimId
    const claim = req.session.data.claims.find(c => c.id === claimId)

    if (!claim) return res.status(404).send('Claim not found')

    res.render('provider/check-identity/index', { claim })
  })


// 2. POST: "Further information is required on this claim" screens
router.post('/provider/check-identity/:claimId', function (req, res) {
  const claimId = req.params.claimId
  res.redirect(`/provider/check-identity/do-you-employ/${claimId}`)
})



 // 2a. GET: "Do you employ" screen
  router.get('/provider/check-identity/do-you-employ/:claimId', function (req, res) {
    const claimId = req.params.claimId
    const claim = req.session.data.claims.find(c => c.id === claimId)

    if (!claim) return res.status(404).send('Claim not found')

    res.render('provider/check-identity/do-you-employ', { claim })
  })


// 2b. POST: "Do you employ?"
router.post('/provider/check-identity/do-you-employ/:claimId', function (req, res) {
  const claimId = req.params.claimId
  const doYouEmploy = req.body.doYouEmploy

  if (doYouEmploy === 'Yes') {
    res.redirect(`/provider/check-identity/personal-details/${claimId}`)
  } else {
    res.redirect(`/provider/check-identity/end-of-verification/${claimId}`)
  }
})

// 3. GET: "You might know this person as a different name"
router.get('/provider/check-identity/you-might-know-as/:claimId', function (req, res) {
  const claimId = req.params.claimId
  const claim = req.session.data.claims.find(c => c.id === claimId)

  res.render('provider/check-identity/you-might-know-as', { claim })
})

// 4. POST: "You might know this person as a different name"
router.post('/provider/check-identity/you-might-know-as/:claimId', function (req, res) {
  const claimId = req.params.claimId
  const mightKnowAs = req.body.mightKnowAs

  if (mightKnowAs === 'Yes') {
    res.redirect(`/provider/check-identity/personal-details/${claimId}`)
  } else {
    res.redirect(`/provider/check-identity/end-of-verification/${claimId}`)
  }
})


// 5. GET: Confirm end of verification
router.get('/provider/check-identity/end-of-verification/:claimId', function (req, res) {
  const claimId = req.params.claimId
  const claim = req.session.data.claims.find(c => c.id === claimId)

  res.render('provider/check-identity/end-of-verification', { claim })
})


// 6. POST: personal details
router.post('/provider/check-identity/personal-details/:claimId', function (req, res) {
  const claimId = req.params.claimId
  const claims = req.session.data.claims || []
  const claim = claims.find(c => c.id === claimId)

  if (!claim) {
    return res.status(404).send('Claim not found')
  }

  // Save to claim object
  claim.returnClaimantDob = {
    day: req.body['returnClaimantDob-day'],
    month: req.body['returnClaimantDob-month'],
    year: req.body['returnClaimantDob-year']
  }
  claim.returnClaimantPostcode = req.body.returnClaimantPostcode
  claim.returnClaimantNationalInsuranceNumber = req.body.returnClaimantNationalInsuranceNumber
  claim.claimantBankDetailsMatch = req.body.claimantBankDetailsMatch
  claim.claimantWorkEmail = req.body.claimantWorkEmail

  // Also store flat values for use in check.html
  req.session.data["returnClaimantDob-day"] = req.body['returnClaimantDob-day']
  req.session.data["returnClaimantDob-month"] = req.body['returnClaimantDob-month']
  req.session.data["returnClaimantDob-year"] = req.body['returnClaimantDob-year']
  req.session.data.returnClaimantPostcode = req.body.returnClaimantPostcode
  req.session.data.returnClaimantNationalInsuranceNumber = req.body.returnClaimantNationalInsuranceNumber
  req.session.data.claimantBankDetailsMatch = req.body.claimantBankDetailsMatch
  req.session.data.claimantWorkEmail = req.body.claimantWorkEmail

  res.redirect(`/provider/check-identity/check/${claimId}`)
})

// 6a. GET: personal details form
router.get('/provider/check-identity/personal-details/:claimId', function (req, res) {
  const claimId = req.params.claimId
  const claims = req.session.data.claims || []
  const claim = claims.find(c => c.id === claimId)

  if (!claim) {
    return res.status(404).send('Claim not found')
  }

  res.render('provider/check-identity/personal-details', { claim })
})



// 9. POST: Check your answers
router.post('/provider/check-identity/check/:claimId', (req, res) => { 
  const claim = getClaim(req, res)
  if (!claim) return res.status(404).send('Claim not found')

  // Update claim status and clear assignment
  claim.status = 'Not started'
  claim.assignedTo = 'You - (current user)'

  // Optional: Store declaration confirmation if needed
  claim.identityDeclarationConfirmed = true

  // Set flash message
  req.flash('success', 'Yaldi')
  // req.flash('success', `Employer check for ${claim.claimantName} complete`)

  // Redirect to the first step in the verification flow
  res.redirect(`/provider/member-of-staff/${claim.id}`)
})

  // 10. GET: check to
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


    res.render('provider/check-identity/check', {
      claim,
      data: req.session.data
    })
  })
}