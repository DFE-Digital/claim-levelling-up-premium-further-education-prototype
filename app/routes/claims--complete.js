const Pagination = require('../helpers/pagination')

module.exports = router => {

  // GET: Update a verified claim
  router.get('/provider/completed/show/:claimId', (req, res) => {
    const claims = req.session.data.claims || []
    const claim = claims.find(c => String(c.id) === req.params.claimId)

    if (!claim) {
      return res.status(404).send('Claim not found')
    }

    if (claim.status !== 'Verified') {
      return res.status(400).send('Only verified claims can be updated from this page.')
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
  
    // 1. Define the verified claims you want to show
    const verifiedClaims = claims.filter(claim => claim.status === 'Verified')
  
    // 2. You still want to add `.verified = true/false` based on logic
    verifiedClaims.forEach(claim => {
      claim.verified = (
        claim.permanentContract === 'yes' &&
        claim.teachingResponsibilities === 'yes' &&
        claim.first5Years === 'yes' &&
        claim.twelveHoursPerWeek === 'yes' &&
        claim.sixteenToNineteen === 'yes' &&
        claim.fundingAtLevelThreeAndBelow === 'yes' &&
        claim.performanceMeasures === 'no' &&
        claim.subjectToDisciplinaryAction === 'no'
      )
    })
  
    // 3. Paginate verified claims
    const pageSize = 10
    const pagination = new Pagination(verifiedClaims, req.query.page, pageSize)
    const paginatedClaims = pagination.getData()
  
    // 4. Render the template with both paginated and full verified claims
    res.render('provider/completed/index', {
      claims: paginatedClaims, // paginated table view
      pagination,
      data: {
        claims: verifiedClaims, // used for cards and counters
        user: req.session.data.user // or hardcode to `true` for testing
      },
      flash: req.flash('success')[0] || ''
    })
  })
  

}