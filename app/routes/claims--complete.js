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
  req.flash('success', 'Yaldi')

  res.redirect(`/provider/completed?claimId=${claim.id}`)
})


  ///// GET: Show all verified claims /////////////////////////
  router.get('/provider/completed', (req, res) => {
    const claims = req.session.data.claims || []
    const claimId = req.query.claimId
    const claim = claims.find(c => String(c.id) === claimId)

    const dfeStatuses = ['Pending', 'Approved', 'Rejected']
    let filteredClaims = claims.filter(claim => dfeStatuses.includes(claim.status))

    // Add verified flag for DfE pending
    filteredClaims.forEach(claim => {
      if (claim.status === 'Pending') {
        const contractType = claim.contractType?.toLowerCase()

        const contractValid =
          contractType === 'permanent' ||
          (contractType === 'fixed-term' && claim.fixedTermAcademicYear === 'Yes') ||
          (contractType === 'variable hours' &&
            claim.variableContractTimetabledHours &&
            claim.variableContractAcademicTerm)

        const subjectAreaValid =
          (claim.teachesLevelThree === 'Yes' && claim.levelThreeHalfTimetableTeachingCourses === 'Yes') ||
          (claim.teachesLevelThree === 'No' &&
            claim.levelThreeSubjectArea &&
            Array.isArray(claim.levelThreeSubjectAreaCourses) &&
            claim.levelThreeSubjectAreaCourses.length > 0)

        claim.verified =
          contractValid &&
          claim.teachingResponsibilities === 'Yes' &&
          claim.first5Years === 'Yes' &&
          claim.hoursAcademicYear === 'Yes' &&
          claim.sixteenToNineteen === 'Yes' &&
          claim.performanceMeasures === 'No' &&
          claim.subjectToDisciplinaryAction === 'No' &&
          claim.timetabledHoursDuringTerm &&
          claim.teachesSixteenToNineteen &&
          subjectAreaValid
      }
    })

    
   // ✅ Sort by claimantFirstName then claimantLastName
    filteredClaims.sort((a, b) => {
      const firstNameA = (a.claimantFirstName || '').toLowerCase()
      const firstNameB = (b.claimantFirstName || '').toLowerCase()
      const lastNameA = (a.claimantLastName || '').toLowerCase()
      const lastNameB = (b.claimantLastName || '').toLowerCase()

      if (firstNameA !== firstNameB) {
        return firstNameA.localeCompare(firstNameB)
      }
      return lastNameA.localeCompare(lastNameB)
    })


    res.render('provider/completed/index', {
      claims: filteredClaims,
      claim
    })
  })

}