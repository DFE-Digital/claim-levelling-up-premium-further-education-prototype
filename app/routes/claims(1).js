
const { govukDate } = require('@x-govuk/govuk-prototype-filters')
const Pagination = require('../helpers/pagination')

module.exports = (router) => {
  const getClaim = (req, res) => {
    const claims = req.session.data.claims || []
    return claims.find(claim => String(claim.id) === req.params.claimId)
  }

  const getNextIncompleteStep = (claim) => {
    if (!claim.teachingResponsibilities || !claim.first5Years || !claim.hasTeachingQualification || !claim.contractType) {
      return 'role-and-experience'
    }
    if (claim.contractType === 'Fixed-term' && !claim.contractAcademicYear) {
      return 'contract-academic-year'
    }
    if (claim.contractType === 'Variable hours' && !claim.hoursAcademicYear) {
      return 'hours-academic-year'
    }
    if (!claim.performanceMeasures || !claim.subjectToDisciplinaryAction) {
      return 'performance-and-discipline'
    }
    if (!claim.contractedHours || !claim.sixteenToNineteen || !claim.fundingAtLevelThreeAndBelow) {
      return 'contracted-hours'
    }
    return 'check'
  }

  // Entry route from claimant name link
  router.get('/provider/return/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    const nextStep = getNextIncompleteStep(claim)
    return res.redirect(`/provider/${nextStep}/${claim.id}`)
  })

  // Multi-step POST handlers
  const saveAndRedirect = (claim, req, res, nextRoute) => {
    claim.status = 'In progress'
    const completed = req.body.completedSection
    if (completed === 'No') {
      return res.redirect(`/provider/save/${claim.id}`)
    }
    return res.redirect(`/provider/${nextRoute}/${claim.id}`)
  }

  router.post('/provider/role-and-experience/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.teachingResponsibilities = req.body.teachingResponsibilities
    claim.first5Years = req.body.first5Years
    claim.hasTeachingQualification = req.body.hasTeachingQualification
    claim.contractType = req.body.contractType

    if (claim.contractType === 'Fixed-term') {
      return saveAndRedirect(claim, req, res, 'contract-academic-year')
    }
    if (claim.contractType === 'Variable hours') {
      return saveAndRedirect(claim, req, res, 'hours-academic-year')
    }
    return saveAndRedirect(claim, req, res, 'performance-and-discipline')
  })

  router.post('/provider/contract-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.contractAcademicYear = req.body.contractAcademicYear
    return saveAndRedirect(claim, req, res, 'performance-and-discipline')
  })

  router.post('/provider/hours-academic-year/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.hoursAcademicYear = req.body.hoursAcademicYear
    return saveAndRedirect(claim, req, res, 'performance-and-discipline')
  })

  router.post('/provider/performance-and-discipline/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.performanceMeasures = req.body.performanceMeasures
    claim.subjectToDisciplinaryAction = req.body.subjectToDisciplinaryAction
    return saveAndRedirect(claim, req, res, 'contracted-hours')
  })

  router.post('/provider/contracted-hours/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')

    claim.contractedHours = req.body.contractedHours
    claim.sixteenToNineteen = req.body.sixteenToNineteen
    claim.fundingAtLevelThreeAndBelow = req.body.fundingAtLevelThreeAndBelow
    return saveAndRedirect(claim, req, res, 'check')
  })

  // Check page
  router.get('/provider/check/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
    res.render('provider/check', { claim })
  })

  // Save confirmation screen
  router.get('/provider/save/:claimId', (req, res) => {
    const claim = getClaim(req, res)
    if (!claim) return res.status(404).send('Claim not found')
    res.render('provider/save', { claim })
  })
}
