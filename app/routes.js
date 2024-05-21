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
  