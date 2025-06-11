module.exports = router => {

  // GET: Update a verified claim
  router.get('/provider/completed/show/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)
  
    if (!claim) {
      return res.status(404).send('Claim not found')
    }
  
    const validStatuses = ['Dfe pending', 'Dfe approved', 'Dfe rejected']
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
  
   // Set a flash message with HTML (text + link)
   req.flash('success', `Claim Verified <a class="govuk-link" href="/provider/completed/check/${claim.id}"><br>View Verified claim</a>`)
  
    res.redirect('/provider/completed')
  })


  router.get('/provider/completed', (req, res) => {
    const claims = req.session.data.claims || []

    const dfeStatuses = ['Dfe pending', 'Dfe approved', 'Dfe rejected']
    let filteredClaims = claims.filter(claim => dfeStatuses.includes(claim.status))

    // Add verified flag for Dfe pending
    filteredClaims.forEach(claim => {
      if (claim.status === 'Dfe pending') {
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