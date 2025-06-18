module.exports = router => {

  // GET: Update a verified claim
  router.get('/provider/completed/show/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    const validStatuses = ['Pending', 'Approved', 'Rejected']
    if (!validStatuses.includes(claim.status)) {
      return res.status(400).send('Only DfE claims can be updated from this page.')
    }
  
    res.render('provider/completed/show', { claim })
  })
  
  /////////////////////////////////////////////////////////////////////////

router.post('/provider/completed/:claimId', (req, res) => {
  const claims = req.session.data.claims || []
  const claim = claims.find(c => String(c.id) === req.params.claimId)

  if (!claim) {
    return res.status(404).send('Claim not found')
  }

  // ✅ Update claim status to Pending
  claim.status = 'Pending'

  // ✅ Optional: add a timestamp for when it was marked complete
  claim.dateVerified = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  claim.dateVerifiedIso = new Date().toISOString()

  // ✅ Flash message
  req.flash('success', `Claim Verified for ${claim.claimantName} <a class="govuk-link" href="/provider/completed/show/${claim.id}"><br>View verified claim</a>`)

  res.redirect('/provider/completed')
})



  router.get('/provider/completed', (req, res) => {
    const claims = req.session.data.claims || []

    const dfeStatuses = ['Pending', 'Approved', 'Rejected']
    let filteredClaims = claims.filter(claim => dfeStatuses.includes(claim.status))

    // Add verified flag for Dfe pending
    filteredClaims.forEach(claim => {
      if (claim.status === 'Pending') {
        claim.verified = (
          claim.contractType?.toLowerCase() === 'permanent' &&
          claim.teachingResponsibilities === 'Yes' &&
          claim.first5Years === 'Yes' &&
          claim.hoursAcademicYear === 'Yes' &&
          claim.sixteenToNineteen === 'Yes' &&
          claim.fundingAtLevelThreeAndBelow === 'Yes' &&
          claim.performanceMeasures === 'No' &&
          claim.subjectToDisciplinaryAction === 'No'
        )
      }
    })

    // ✅ Sort all DfE claims alphabetically by surname
    filteredClaims.sort((a, b) => {
      const surnameA = a.claimantName.split(' ').slice(-1)[0].toLowerCase()
      const surnameB = b.claimantName.split(' ').slice(-1)[0].toLowerCase()
      return surnameA.localeCompare(surnameB)
    })

    res.render('provider/completed/index', {
      claims: filteredClaims
    })
  }) 

}