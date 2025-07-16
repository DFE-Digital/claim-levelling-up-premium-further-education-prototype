module.exports = router => {

  ////////////////////// ACADEMIC YEAR IN FURTHE EDUCATION. //////////////////////
  router.post('/eligibility/academic-year-in-further-education', (req, res) => {
  const academicYearInFurtherEducation = req.body.academicYearInFurtherEducation

    if (academicYearInFurtherEducation === 'Before September 2021') {
      res.redirect('/eligibility/not-eligible/not-eligible')
    }
      res.redirect('/eligibility/teaching-qualification')
  })


}

