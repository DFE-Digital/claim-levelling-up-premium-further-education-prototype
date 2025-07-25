module.exports = router => {

  ////////////////////// ACADEMIC YEAR IN FURTHER EDUCATION //////////////////////
  router.post('/eligibility/academic-year-in-further-education', (req, res) => {
    const academicYearInFurtherEducation = req.body.academicYearInFurtherEducation

    if (academicYearInFurtherEducation === 'Before September 2021') {
      return res.redirect('/eligibility/not-eligible')
    }

    return res.redirect('/eligibility/teaching-qualification')
  })

  ////////////////////// TEACHING QUALIFICATION //////////////////////
  router.post('/eligibility/teaching-qualification', (req, res) => {
    const claimantTeachingQualification = req.body.claimantTeachingQualification

    if (claimantTeachingQualification === 'No, and I do not plan to enrol on one in the next 12 months') {
      return res.redirect('/eligibility/not-eligible')
    }

    return res.redirect('/eligibility/teaching-responsibilities')
  })

  ////////////////////// TEACHING RESPONSIBILITIES //////////////////////
  router.post('/eligibility/teaching-responsibilities', (req, res) => {
    const claimantTeachingResponsibilities = req.body.claimantTeachingResponsibilities

    if (claimantTeachingResponsibilities === 'No') {
      return res.redirect('/eligibility/not-eligible')
    }

    return res.redirect('/eligibility/fe-provider')
  })

  ////////////////////// FURTHER EDUCATION PROVIDER //////////////////////
  router.post('/eligibility/fe-provider', (req, res) => {
    const worksAtFeProvider = req.body.worksAtFeProvider
    req.session.data.worksAtFeProvider = worksAtFeProvider

    return res.redirect('/eligibility/where-are-you-employed')
  })

  ////////////////////// GET: WHERE ARE YOU EMPLOYED //////////////////////
  router.get('/eligibility/where-are-you-employed', (req, res) => {
    const worksAtFeProvider = req.session.data.worksAtFeProvider || 'Your provider'
    const providerAddress = '[Address of the FE provider]' // Optional: dynamically populate

    return res.render('eligibility/where-are-you-employed', {
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

    return res.redirect('/eligibility/type-of-contract')
  })

  ////////////////////// GET: TYPE OF CONTRACT //////////////////////
  router.get('/eligibility/type-of-contract', (req, res) => {
    const claimantWhereAreYouEmployed = req.session.data.claimantWhereAreYouEmployed
    return res.render('eligibility/type-of-contract', { claimantWhereAreYouEmployed })
  })

  ////////////////////// POST: TYPE OF CONTRACT //////////////////////
  router.post('/eligibility/type-of-contract', (req, res) => {
    const claimantContractType = req.body.claimantContractType
    req.session.data.claimantContractType = claimantContractType
    const worksAtFeProvider = req.session.data.worksAtFeProvider || 'Your provider'

    if (claimantContractType === 'Permanent') {
      return res.redirect('/eligibility/teaching-hours-per-week')
    } else if (claimantContractType === 'Fixed-term') {
      return res.redirect('/eligibility/fixed-term-contract')
    } else if (claimantContractType === 'Variable hours') {
      return res.redirect('/eligibility/variable-one-full-term')
    } else if (claimantContractType === 'Employed by another organisation (for example, an agency or contractor)') {
      return res.redirect('/eligibility/not-eligible')
    } else {
      return res.redirect('/eligibility/type-of-contract')
    }
  })

  ////////////////////// POST: FIXED TERM CONTRACT //////////////////////
  router.post('/eligibility/fixed-term-contract', (req, res) => {
    const claimantFixedTermContract = req.body.claimantFixedTermContract
    req.session.data.claimantFixedTermContract = claimantFixedTermContract

    if (claimantFixedTermContract === 'No') {
      return res.redirect('/eligibility/not-eligible')
    } else {
      return res.redirect('/eligibility/teaching-hours-per-week')
    }
  })

  ////////////////////// POST: VARIABLE ONE FULL TERM //////////////////////
  router.post('/eligibility/variable-one-full-term', (req, res) => {
    const claimantTaughtOneFullTerm = req.body.claimantTaughtOneFullTerm
    req.session.data.claimantTaughtOneFullTerm = claimantTaughtOneFullTerm

    if (claimantTaughtOneFullTerm === 'No') {
      return res.redirect('/eligibility/not-eligible')
    } else {
      return res.redirect('/eligibility/variable-timetabled-to-teach')
    }
  })

  ////////////////////// POST: VARIABLE TIMETABLED TO TEACH //////////////////////
  router.post('/eligibility/variable-timetabled-to-teach', (req, res) => {
    const claimantVariableTimetabledToTeach = req.body.claimantVariableTimetabledToTeach
    req.session.data.claimantVariableTimetabledToTeach = claimantVariableTimetabledToTeach

    if (claimantVariableTimetabledToTeach === 'No') {
      return res.redirect('/eligibility/not-eligible')
    } else {
      return res.redirect('/eligibility/teaching-hours-per-week')
    }
  })

  ////////////////////// POST: TEACHING HOURS PER WEEK //////////////////////
  router.post('/eligibility/teaching-hours-per-week', (req, res) => {
    const claimantTeachingHoursPerWeek = req.body.claimantTeachingHoursPerWeek
    req.session.data.claimantTeachingHoursPerWeek = claimantTeachingHoursPerWeek

    if (claimantTeachingHoursPerWeek === 'More than 12 hours per week' || claimantTeachingHoursPerWeek === 'Between 2.5 and 12 hours per week') {
      return res.redirect('/eligibility/hours-teaching-sixteen-to-nineteen')
    } else if (claimantTeachingHoursPerWeek === 'Less than 2.5 hours per week') {
      return res.redirect('/eligibility/not-eligible')
    } else {
      return res.redirect('/eligibility/teaching-hours-per-week')
    }
  })

  ////////////////////// POST: SIXTEEN TO NINETEEN //////////////////////
  router.post('/eligibility/hours-teaching-sixteen-to-nineteen', (req, res) => {
    const sixteenToNineteenTeachingHours = req.body.sixteenToNineteenTeachingHours
    req.session.data.sixteenToNineteenTeachingHours = sixteenToNineteenTeachingHours

    if (sixteenToNineteenTeachingHours === 'No') {
      return res.redirect('/eligibility/not-eligible')
    } else {
      return res.redirect('/eligibility/subject-area/subject-areas')
    }
  })

  ////////////////////// SUBJECT AREAS POST //////////////////////
  router.post('/eligibility/subject-area/subject-areas', function (req, res) {
    let selectedSubjects = req.body.subjects || []

    selectedSubjects = Array.isArray(selectedSubjects)
      ? selectedSubjects.filter(subject => subject !== '_unchecked')
      : selectedSubjects !== '_unchecked' ? [selectedSubjects] : []

    if (selectedSubjects.includes('I do not teach any of these subjects')) {
      return res.redirect('/eligibility/not-eligible')
    }

    req.session.data.subjects = selectedSubjects
    req.session.data.remainingSubjects = [...selectedSubjects]

    const firstSubject = req.session.data.remainingSubjects.shift()
    return routeToSubjectCourse(res, firstSubject)
  })

  ////////////////////// NEXT SUBJECT PAGE POST //////////////////////
  router.post('/eligibility/subject-area/next-subject-page', function (req, res) {
    const subject = req.body.previousCoursePage
    const selected = req.body[subject]

    if (selected) {
      const filtered = Array.isArray(selected)
        ? selected.filter(item => item !== '_unchecked')
        : selected !== '_unchecked' ? [selected] : []

      req.session.data[subject] = filtered
    }

    console.log('Saving to session:', subject, '=', req.session.data[subject])

    const nextSubject = req.session.data.remainingSubjects.shift()
    if (nextSubject) {
      return routeToSubjectCourse(res, nextSubject)
    } else {
      return res.redirect('/eligibility/half-timetabled-teaching-hours-teaching-eligible-courses')
    }
  })

  ////////////////////// GET: PREPARE SELECTED COURSE LIST //////////////////////
  router.get('/eligibility/half-timetabled-teaching-hours-teaching-eligible-courses', function (req, res) {
    const subjects = req.session.data.subjects || []
    const subjectCourses = []

    console.log('SUBJECTS:', subjects)

    subjects.forEach(subject => {
      const selectedCourses = req.session.data[subject] || []
      console.log(`Courses for ${subject}:`, selectedCourses)
      selectedCourses.forEach(course => {
        subjectCourses.push(course)
      })
    })

    return res.render('eligibility/half-timetabled-teaching-hours-teaching-eligible-courses', {
      subjectCourses
    })
  })

  ////////////////////// POST: HALF TIMETABLED COURSES //////////////////////
  router.post('/eligibility/half-timetabled-teaching-hours-teaching-eligible-courses', function (req, res) {
    var halfTimetabledTeachingHoursEligibleCourses = req.session.data['halfTimetabledTeachingHoursEligibleCourses']
    if (halfTimetabledTeachingHoursEligibleCourses == 'No') {
      return res.redirect('/eligibility/not-eligible')
    } else {
      return res.redirect('/eligibility/performance')
    }
  })

  ////////////////////// POST: PERFORMANCE CHECK //////////////////////
  router.post('/eligibility/performance', function (req, res) {
    const performance = req.session.data['claimantPerformanceMeasures']
    const disciplinary = req.session.data['claimantDisciplinaryAction']
    const oneIsYes = (performance === 'Yes' || disciplinary === 'Yes')

    if (oneIsYes) {
      console.warn('⚠️ User has answered Yes to one or both performance/disciplinary questions')
      req.session.data['ineligibleByPerformanceCheck'] = true
      return res.redirect('/eligibility/not-eligible')
    }

    return res.redirect('/eligibility/check')
  })

  ////////////////////// POST: CHECK //////////////////////
  router.post('/eligibility/check', (req, res) => {
    return res.redirect('/eligibility/you-are-eligible')
  })

  ////////////////////// SUBJECT COURSE REDIRECT HANDLER //////////////////////
  function routeToSubjectCourse(res, subject) {
    const map = {
      'Building and construction': '/eligibility/subject-area/courses/building-course',
      'Chemistry': '/eligibility/subject-area/courses/chemistry-course',
      'Computing, including digital and ICT': '/eligibility/subject-area/courses/computing-course',
      'Early years': '/eligibility/subject-area/courses/early-years-course',
      'Engineering and manufacturing, including transport engineering and electronics': '/eligibility/subject-area/courses/engineering-course',
      'Maths': '/eligibility/subject-area/courses/maths-course',
      'Physics': '/eligibility/subject-area/courses/physics-course'
    }
    return res.redirect(map[subject] || '/eligibility/half-timetabled-teaching-hours-teaching-eligible-courses')
  }
}
