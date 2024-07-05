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

   router.post('/teaching-hours-per-week-fixed', function (req, res){
      var fixedtermcontract = req.session.data['fixedTermContract'];
      if (fixedtermcontract == 'Yes, it covers the full 2024 to 2025 academic year') {
        res.redirect('/teaching-hours-per-week-fixed');
      } else {
        res.redirect('/one-full-term');
      }
    });


    router.post('/teaching-hours-per-week-variable', function (req, res){
      var oneFullTerm = req.session.data['oneFullTerm'];
      if (oneFullTerm == 'Yes, I have taught at [FE provider] for at least one academic term') {
        res.redirect('/teaching-hours-per-week-variable');
      } else {
        res.redirect('/you-are-not-eligible-yet');
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
  
