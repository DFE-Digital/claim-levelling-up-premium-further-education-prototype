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
  
    // Only include DfE status claims
    const dfeStatuses = ['Dfe pending', 'Dfe approved', 'Dfe rejected']
    let filteredClaims = claims.filter(claim => dfeStatuses.includes(claim.status))
  
    // Optional: add verified flag (only for Dfe pending)
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
  
    // 🆕 Sort to show most recently updated DfE claim first
    const updatedId = req.session.data.lastUpdatedClaimId
    if (updatedId) {
      filteredClaims.sort((a, b) => (a.id === updatedId ? -1 : b.id === updatedId ? 1 : 0))
    }
  
    // Pagination
    const paginatedClaims = filteredClaims
  
    res.render('provider/completed/index', {
      claims: paginatedClaims,
      })
  })
  
  

}