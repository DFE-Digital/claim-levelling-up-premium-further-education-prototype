module.exports = router => {

  ////////////////////// ACADEMIC YEAR IN FURTHE EDUCATION. //////////////////////
  router.post('/eligibility/academic-year-in-further-education', (req, res) => {
  const academicYearInFurtherEducation = req.body.academicYearInFurtherEducation

    if (academicYearInFurtherEducation === 'Before September 2021') {
      res.redirect('/eligibility/not-eligible/not-eligible')
    }
      res.redirect('/eligibility/teaching-qualification')
  })

  ////////////////////// TEACHING QUALIFICATION. //////////////////////
  router.post('/eligibility/teaching-qualification', (req, res) => {
    const claimantTeachingQualification = req.body.claimantTeachingQualification

    if (claimantTeachingQualification === 'No, and I do not plan to enrol on one in the next 12 months') {
      res.redirect('/eligibility/not-eligible/not-eligible')
    }
      res.redirect('/eligibility/teaching-responsibilities')
  })

  ////////////////////// TEACHING QUALIFICATION. //////////////////////
  router.post('/eligibility/teaching-responsibilities', (req, res) => {
    const claimantTeachingResponsibilities = req.body.claimantTeachingResponsibilities

    if (claimantTeachingResponsibilities === 'No') {
      res.redirect('/eligibility/not-eligible/not-eligible')
    }
     res.redirect('/eligibility/fe-provider')
  })



}

