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

  ////////////////////// POST: TEACHING HOURS PER WEEK //////////////////////
  router.post('/eligibility/teaching-hours-per-week', (req, res) => {
    const claimantTeachingHoursPerWeek = req.body.claimantTeachingHoursPerWeek

    // Store the selected value in session
    req.session.data.claimantTeachingHoursPerWeek = claimantTeachingHoursPerWeek

    if (claimantTeachingHoursPerWeek === 'More than 12 hours per week' || claimantTeachingHoursPerWeek === 'Between 2.5 and 12 hours per week') {
      res.redirect('/eligibility/hours-teaching-sixteen-to-nineteen')
    } else if (claimantTeachingHoursPerWeek === 'Less than 2.5 hours per week') {
      res.redirect('/eligibility/not-eligible')
    } else {
      // No option selected – redirect back to form (you could add error handling here)
      res.redirect('/eligibility/teaching-hours-per-week')
    }
  })


    ////////////////////// POST: SIXTEEN TO NINETEEN //////////////////////
  router.post('/eligibility/hours-teaching-sixteen-to-nineteen', (req, res) => {
    const sixteenToNineteenTeachingHours = req.body.sixteenToNineteenTeachingHours
    req.session.data.sixteenToNineteenTeachingHours = sixteenToNineteenTeachingHours

      res.redirect('/eligibility/subject-area/subject-areas')

  })


  ////////////////////// POST: SUBJECT AREAS //////////////////////

router.post('/subject-areas', function (req, res) {
  subjectAreas = req.session.data['subjects'] /// ['subjects '] <-- this is the name value of the checkboxes component

  if (subjectAreas.includes('I do not teach any of these subjects')) {
    res.redirect('/eligibility/not-eligible')
    } else {
        var subjectValue = subjectAreas[0]
        subjectAreas.splice(0, 1)
        if (subjectValue === 'Building and construction') {
          res.redirect(['/eligibility/subject-area/courses/building-course'])
        } else if (subjectValue === 'Chemistry') {
          res.redirect('/eligibility/subject-area/courses/chemistry-course')
        } else if (subjectValue === 'Computing, including digital and ICT') {
          res.redirect('/eligibility/subject-area/courses/computing-course')
        } else if (subjectValue === 'Early years') {
          res.redirect('/eligibility/subject-area/courses/early-years-course')
        } else if (subjectValue === 'Engineering and manufacturing, including transport engineering and electronics') {
          res.redirect('/eligibility/subject-area/courses/engineering-course')
        } else if (subjectValue === 'Maths') {
          res.redirect('/eligibility/subject-area/courses/maths-course')
        } else if (subjectValue === 'Physics') {
          res.redirect('/eligibility/subject-area/courses/physics-course')
        }
    }
  })


  //////////////// NEXT SUBJECT PAGE HANDLER ////////////////

var subjectAreas = null;

router.post('/next-subject-page', function (req, res) {
  //var currentSubjectIndex = subjectAreas.indexOf(req.body.previousCoursePage);
  if (subjectAreas.length > 0){
    var subjectValue = subjectAreas[0];
    subjectAreas.splice(0, 1);
    if (subjectValue === 'Chemistry') {
      res.redirect('/chemistry-course');
    } else if (subjectValue === 'Computing, including digital and ICT') {
      res.redirect('/computing-course');
    } else if (subjectValue === 'Early years') {
      res.redirect('/early-years-course');
    } else if (subjectValue === 'Engineering and manufacturing, including transport engineering and electronics') {
      res.redirect('/engineering-course');
    } else if (subjectValue === 'Maths') {
      res.redirect('/maths-course');
    } else if (subjectValue === 'Physics') {
      res.redirect('/physics-course');
    } 

  } else {
    res.redirect('/teaching-courses');
  }
});



}
