//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()


// Eligible provider
router.post('/fe-provider', function (req, res){
    var teachingresponsibilities = req.session.data['memberOfstaff'];
    if (teachingresponsibilities == 'Yes') {
      res.redirect('/fe-provider');
    } else {
      res.redirect('/you-are-not-eligible');
    }
  });

  
// Contract of employment
  router.post('/teaching-hours-per-week', function (req, res){
    var contractofemployment = req.session.data['contractOfEmployment'];
    if (contractofemployment == 'Permanent contract (including full-time and part-time contracts)')
    {
      res.redirect('/teaching-hours-per-week');
    }
    else if (contractofemployment == 'Fixed-term contract')
    {
      res.redirect('/fixed-term-contract');
    }
    else if (contractofemployment == 'Variable hours contract (including zero hours contract and hourly paid)')
    {
      res.redirect('/one-full-term');
    } 
   });

   // fixed term contract original
    router.post('/teaching-hours-per-week-fixed', function (req, res){
      var fixedTermContract = req.session.data['fixedTermContract'];
      if (fixedTermContract == 'Yes, it covers the full 2024 to 2025 academic year') {
        res.redirect('/teaching-hours-per-week-fixed');
      } else {
        res.redirect('/one-full-term-fixed');
      }
    });

    


   

    // variable
    router.post('/teaching-hours-per-week-variable', function (req, res){
      var oneFullTerm = req.session.data['oneFullTerm'];
      if (oneFullTerm == 'Yes, I have taught at [FE provider] for at least one academic term') {
        res.redirect('/teaching-hours-per-week-variable');
      } else {
        res.redirect('/you-are-not-eligible-yet');
      }
    });

   
    // Teaching hours per week original
  router.post('/academic-year-in-further-education', function (req, res) {
    var teachingHoursPerWeek = req.session.data['week'];
    if (teachingHoursPerWeek == 'Less than 2.5 hours per week') {
      res.redirect('/not-eligible-term');
    } else {
      res.redirect('/academic-year-in-further-education');
    }
  }); 

  // Teaching hours per week fixed term
  router.post('/academic-year-fe-fixed', function (req, res) {
    var teachingHoursPerWeekFixed = req.session.data['week'];
    if (teachingHoursPerWeekFixed == 'Less than 2.5 hours per week') {
      res.redirect('/not-eligible-term');
    } else {
      res.redirect('/academic-year-fe-fixed');
    }
  }); 

  
// Teaching hours per week varible
  router.post('/timetabled-to-teach', function (req, res) {
    var teachingHoursPerWeekVariable = req.session.data['week'];
    if (teachingHoursPerWeekVariable == 'Less than 2.5 hours per week') {
      res.redirect('/not-eligible-term');
    } else {
      res.redirect('/timetabled-to-teach');
    }
  }); 

  router.post('/academic-year-in-fe-variable', function (req, res) {
    var timetabledToTeach = req.session.data['timetabledToTeach'];
    if (timetabledToTeach == 'No, I’m not timetabled to teach at least 2.5 hours at [FE provider] next term') {
      res.redirect('/not-eligible-ongoing');
    } else {
      res.redirect('/academic-year-in-fe-variable');
    }
  }); 

  // five years in teaching

  router.post('/subject-areas', function (req, res) {
    var academicTearInFurtherEducation = req.session.data['academicYearInFurtherEducation'];
    if (academicTearInFurtherEducation == 'I started before September 2020') {
      res.redirect('/you-are-not-eligible-five-years');
    } else {
      res.redirect('/subject-areas');
    }
  });


  router.post('/subject-areas-variable', function (req, res) {
    var academicYearInFeVariable = req.session.data['academicYearInFurtherEducation'];
    if (academicYearInFeVariable == 'I started before September 2020') {
      res.redirect('/you-are-not-eligible-five-years');
    } else {
      res.redirect('/subject-areas-variable');
    }
  });


  



// subjects start


router.post('/subject-areas-route', function (req, res) {
  subjectAreas = req.session.data['subjects'];

  if (subjectAreas.includes('I do not teach any of these subjects')) {
    res.redirect('/you-are-not-eligible-subjects');
  } else {
      var subjectValue = subjectAreas[0];
      subjectAreas.splice(0, 1)
      if (subjectValue === 'Building and construction') {
        res.redirect(['/building-course']);
      } else if (subjectValue === 'Chemistry') {
        res.redirect('/chemistry-course');
      } else if (subjectValue === 'Computing, including digital and ICT') {
        res.redirect('/computing-course');
      }else if (subjectValue === 'Early years') {
        res.redirect('/early-years-course');
      }else if (subjectValue === 'Engineering and manufacturing, including transport engineering and electronics') {
        res.redirect('/engineering-course');
      }else if (subjectValue === 'Maths') {
        res.redirect('/maths-course');
      }else if (subjectValue === 'Physics') {
        res.redirect('/physics-course');
      }
  }
});


//next sub pag

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

  
 // subjects variable



  // teaching courses
  router.post('/half-teaching-hours', function (req, res) {
    var teachingCourses = req.session.data['teachingcourses'];
    if (teachingCourses == 'No') {
      res.redirect('/not-eligible-teach-half-hours-courses');
    } else {
      res.redirect('/half-teaching-hours');
    }
  });

  // 16-19

  router.post('/qualification', function (req, res) {
    var halfTeachingHours = req.session.data['halfteachinghours'];
    if (halfTeachingHours == 'No') {
      res.redirect('/not-eligible-16-19');
    } else {
      res.redirect('/qualification');
    }
  });


  // qualification 
  router.post('/performance', function (req, res){
    var qualification = req.session.data['qualification'];
    if (qualification == 'No, and I do not plan to enrol on one in the next 12 months') {
      res.redirect('/not-eligible-qualification');
    } else {
      res.redirect('/performance');
    }
  });

    //performance and disiplinary
  router.post('/check-answers', function (req, res){
    var performance = req.session.data['performance-measure'];
    var disciplinaryAction = req.session.data['disciplinary-action'];

    if (performance === 'Yes' && disciplinaryAction === 'Yes') {
      res.redirect('/not-eligible-PA-DA');
    } else if (performance === 'No' && disciplinaryAction === 'No') {
      res.redirect('/check-answers');
    } else if (performance === 'Yes' && disciplinaryAction === 'No') {
      res.redirect('/not-eligible-PA-DA');
    } else if (performance === 'No' && disciplinaryAction === 'Yes') {
      res.redirect('/not-eligible-PA-DA');
    }
  });



  ///// Call in other routes
  require('./routes/account')(router)
  require('./routes/claims')(router)
  require('./routes/claims--assign')(router)


 


  
