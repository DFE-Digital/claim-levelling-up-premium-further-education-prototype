//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

router.post('/fe-provider', function (req, res){
    var teachingresponsibilities = req.session.data['memberOfstaff'];
    if (teachingresponsibilities == 'Yes') {
      res.redirect('/fe-provider');
    } else {
      res.redirect('/you-are-not-eligible');
    }
  });

  router.post('/academic-year-in-further-education', function (req, res) {
    var contractOfEmployment = req.session.data['contractOfEmployment'];
    if (contractOfEmployment === 'Vairable hours contract (including zero-hours contracts)') {
      res.redirect('/one-full-term');
    } else {
      res.redirect('/academic-year-in-further-education');
    }
  });

  
  router.post('/academic-year-in-further-education', function (req, res){
    var oneFullTerm = req.session.data['term'];
    if (oneFullTerm === 'No, I have not worked one full term before applying') {
      res.redirect('/you-are-not-eligible-yet');
    } else {
      res.redirect('/academic-year-in-further-education');
    }
  });

  router.post('/teaching-hours-per-week', function (req, res){
    var academicYearInFurtherEducation = req.session.data['year'];
    if (academicYearInFurtherEducation == 'Before September 2020') {
      res.redirect('/you-are-not-eligible-five-years');
    } else {
      res.redirect('/teaching-hours-per-week');
    }
  });
  
  router.post('/half-teaching-hours', function (req, res) {
    var teachingHoursPerWeek = req.session.data['week'];
    if (teachingHoursPerWeek == 'Less than 2.5 hours per week') {
      res.redirect('/not-eligible-hours-spent-teaching');
    } else {
      res.redirect('/half-teaching-hours');
    }
  });

  router.post('/half-teaching-hours', function (req, res) {
    var teachingHoursPerWeekVariable = req.session.data['week'];
    if (teachingHoursPerWeekVariable == 'Less than 2.5 hours per week') {
      res.redirect('/not-eligible-hours-spent-teaching');
    } else {
      res.redirect('/half-teaching-hours');
    }
  });

  router.post('/subject-areas', function (req, res) {
    var halfTeachingHours = req.session.data['hoursHalf'];
    if (halfTeachingHours == 'No') {
      res.redirect('/not-eligible-16-19');
    } else {
      res.redirect('/subject-areas');
    }
  });



  router.post('/qualification', function (req, res) {
    var teachingCourses = req.session.data['courses'];
    if (teachingCourses == 'No') {
      res.redirect('/you-are-not-eligible-courses');
    } else {
      res.redirect('/qualification');
    }
  }); 

  router.post('/performance', function (req, res) {
    var qualification = req.session.data['qual'];
    if (qualification == 'No, and I do not plan to start working towards one in the next 12 months') {
      res.redirect('/not-eligible-qualification');
    } else {
      res.redirect('/performance');
    }
  }); 
  
