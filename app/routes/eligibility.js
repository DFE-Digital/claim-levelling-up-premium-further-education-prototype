module.exports = router => {

  ////////////////////// ACADEMIC YEAR IN FURTHER EDUCATION //////////////////////
  router.post('/eligibility/academic-year-in-further-education', (req, res) => {
    const academicYearInFurtherEducation = req.body.academicYearInFurtherEducation

    if (academicYearInFurtherEducation === 'Before September 2021') {
      res.redirect('/eligibility/not-eligible')
    }

    res.redirect('/eligibility/teaching-qualification')
  })

  ////////////////////// TEACHING QUALIFICATION //////////////////////
  router.post('/eligibility/teaching-qualification', (req, res) => {
    const claimantTeachingQualification = req.body.claimantTeachingQualification

    if (claimantTeachingQualification === 'No, and I do not plan to enrol on one in the next 12 months') {
      res.redirect('/eligibility/not-eligible')
    }

    res.redirect('/eligibility/teaching-responsibilities')
  })

  ////////////////////// TEACHING RESPONSIBILITIES //////////////////////
  router.post('/eligibility/teaching-responsibilities', (req, res) => {
    const claimantTeachingResponsibilities = req.body.claimantTeachingResponsibilities

    if (claimantTeachingResponsibilities === 'No') {
      res.redirect('/eligibility/not-eligible')
    }

    res.redirect('/eligibility/fe-provider')
  })

  ////////////////////// FURTHER EDUCATION PROVIDER //////////////////////
  router.post('/eligibility/fe-provider', (req, res) => {
    const worksAtFeProvider = req.body.worksAtFeProvider
    req.session.data.worksAtFeProvider = worksAtFeProvider

    res.redirect('/eligibility/where-are-you-employed')
  })

  ////////////////////// GET: WHERE ARE YOU EMPLOYED //////////////////////
  router.get('/eligibility/where-are-you-employed', (req, res) => {
    const worksAtFeProvider = req.session.data.worksAtFeProvider || 'Your provider'
    const providerAddress = '[Address of the FE provider]' // Optional: dynamically populate

    res.render('eligibility/where-are-you-employed', {
      radios: [
        {
          value: worksAtFeProvider,
          text: worksAtFeProvider,
          hint: {
            text: providerAddress
          }
        }
      ]
    })
  })

  ////////////////////// POST: WHERE ARE YOU EMPLOYED //////////////////////
  router.post('/eligibility/where-are-you-employed', (req, res) => {
    const claimantWhereAreYouEmployed = req.body.claimantWhereAreYouEmployed
    req.session.data.claimantWhereAreYouEmployed = claimantWhereAreYouEmployed

    res.redirect('/eligibility/type-of-contract')
  })


  
  ////////////////////// GET: TYPE OF CONTRACT //////////////////////
  router.get('/eligibility/type-of-contract', (req, res) => {
    const claimantWhereAreYouEmployed = req.session.data.claimantWhereAreYouEmployed
    res.render('eligibility/type-of-contract', { claimantWhereAreYouEmployed })
  })

  ////////////////////// POST: TYPE OF CONTRACT //////////////////////
  router.post('/eligibility/type-of-contract', (req, res) => {
    const claimantContractType = req.body.claimantContractType

    // Optional: store selection in session
    req.session.data.claimantContractType = claimantContractType
    worksAtFeProvider = req.session.data.worksAtFeProvider || 'Your provider'

    if (claimantContractType === 'Permanent') {
      res.redirect('/eligibility/teaching-hours-per-week')
    } else if (claimantContractType === 'Fixed-term') {
      res.redirect('/eligibility/fixed-term-contract')
    } else if (claimantContractType === 'Variable hours') {
      res.redirect('/eligibility/variable-one-full-term')
    } else if (claimantContractType === 'Employed by another organisation (for example, an agency or contractor)') {
      res.redirect('/eligibility/not-eligible')
    } else {
      // Fallback: redirect back to form (e.g. if nothing selected)
      res.redirect('/eligibility/type-of-contract')
    }
  })

  ////////////////////// POST: FIXED TERM CONTRACT //////////////////////
  router.post('/eligibility/fixed-term-contract', (req, res) => {
    const claimantFixedTermContract = req.body.claimantFixedTermContract
    req.session.data.claimantFixedTermContract = claimantFixedTermContract

    if (claimantFixedTermContract === 'No') {
       res.redirect('/eligibility/not-eligible') 
    } else {
      res.redirect('/eligibility/teaching-hours-per-week')  
    }  
  })

  ////////////////////// POST: VARIABLE ONE FULL TERM //////////////////////
  router.post('/eligibility/variable-one-full-term', (req, res) => {
    const claimantTaughtOneFullTerm = req.body.claimantTaughtOneFullTerm
    req.session.data.claimantTaughtOneFullTerm = claimantTaughtOneFullTerm

      res.redirect('/eligibility/variable-timetabled-to-teach')

  })

  ////////////////////// POST: VARIABLE TIMETABLED TO TEACH //////////////////////
  router.post('/eligibility/variable-timetabled-to-teach', (req, res) => {
    const claimantVariableTimetabledToTeach = req.body.claimantVariableTimetabledToTeach
    req.session.data.claimantVariableTimetabledToTeach = claimantVariableTimetabledToTeach

      res.redirect('/eligibility/teaching-hours-per-week')

  })


}
