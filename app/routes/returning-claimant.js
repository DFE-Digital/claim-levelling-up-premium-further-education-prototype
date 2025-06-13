module.exports = router => {

router.post('/one-login-returning-claimant/received-retention-incentive-before', (req, res) => {
  const received = req.session.data.receivedRetentionIncentive

  if (!received) {
    return res.render('one-login-returning-claimant/received-retention-incentive-before', {
      error: {
        text: 'Select an option',
        href: '#receivedRetentionIncentive'
      },
      data: req.session.data
    })
  }

  if (received === 'Yes') {
    return res.redirect('/one-login-returning-claimant/one-login-sign-in-only')
  }

  // If No or anything else
  res.redirect('/one-login-returning-claimant/do-you-have-a-one-login-account')
})



router.post('/one-login-returning-claimant/do-you-have-a-one-login-account', (req, res) => {
  const hasOneLoginAccount = req.session.data.hasOneLoginAccount

  if (!hasOneLoginAccount) {
    return res.render('one-login-returning-claimant/do-you-have-a-one-login-account', {
      error: {
        text: 'Select if you have a GOV.UK One Login account',
        href: '#hasOneLoginAccount'
      },
      data: req.session.data
    })
  }

  const nextStep = (hasOneLoginAccount === 'Yes' || hasOneLoginAccount === "I don't know")
    ? '/one-login-returning-claimant/one-login-sign-in-only'
    : '/start'

  res.redirect(nextStep)
})


  router.post('/one-login-returning-claimant/one-login-sign-in-only', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-returning-claimant/one-login-email')
    
  })


  /////////// ONE LOGIN SIGN IN ////////////
  router.post('/one-login-returning-claimant/one-login-email', (req, res) => {
    const oneLoginEmail = req.session.data.oneLoginEmail

    if (!oneLoginEmail) {
      return res.render('one-login-returning-claimant/one-login-email', {
        error: {
          text: 'Enter your One Login email address',
          href: '#one-login-email'
        },
        data: req.session.data
      })
    }

    res.redirect('/one-login-returning-claimant/one-login-password')
  })

  /////////// ONE LOGIN PASSWORD ////////////
  router.post('/one-login-returning-claimant/one-login-password', (req, res) => {
  const oneLoginPassword = req.session.data.oneLoginPassword
  if (!oneLoginPassword) {
    return res.render('one-login-returning-claimant/one-login-password', {
      error: {
        text: 'Enter your One Login password',
        href: '#one-login-password'
      },
      data: req.session.data
    })
  }
  res.redirect('/one-login-returning-claimant/one-login-one-time-passcode');
})



  /////////// ONE LOGIN ONE TIME PASSCODE ////////////
  router.post('/one-login-returning-claimant/one-login-one-time-passcode', (req, res) => {
    const securityCode = req.session.data.securityCode
    if (!securityCode) {
      return res.render('one-login-returning-claimant/one-login-one-time-passcode', {
        error: {
          text: 'Enter the 6-digit security code',
          href: '#security-code'
        },
        data: req.session.data
      })
    }
    res.redirect('/one-login-returning-claimant/one-login-signed-in');
  })




  router.post('/one-login-returning-claimant/one-login-signed-in', (req, res) => {
    let data = req.session.data
    
    res.redirect('/one-login-returning-claimant/find-another-way')
    
  })

  /////////// FIND ANOTHER WAY ////////////
  router.post('/one-login-returning-claimant/find-another-way', (req, res) => {
    const choice = req.session.data.findAnotherWay
    if (!choice) {
      return res.render('one-login-returning-claimant/find-another-way', {
        error: {
          text: 'Select an option',
          href: '#findAnotherWay'
        },
        data: req.session.data
      })
    }
    if (choice === 'continue') {
      res.redirect('/one-login-returning-claimant/confirm-college');
    } else {
      res.redirect('https://govuk-one-login-prototype-6d2545e2d700.herokuapp.com/page-index/authentication/create-account');
    }
  })



  /////////// CONFIRM COLLEGE WORK EMAIL ACCOUNT ////////////
  router.post('/one-login-returning-claimant/confirm-college', (req, res) => {
    const hasWorkEmail = req.session.data.hasWorkEmail
    
    if (!hasWorkEmail) {
      return res.render('one-login-returning-claimant/confirm-college', {
        error: {
          text: 'Select if you have access to your college email account',
          href: '#hasWorkEmail'
        },
        data: req.session.data
      })
    }
    const nextStep = (hasWorkEmail === 'Yes')
      ? '/one-login-returning-claimant/work-email'
      : '/one-login-returning-claimant/signed-you-out'
    res.redirect(nextStep)
  })

  
  /////////// ENTER WORK EMAIL  ////////////
  router.post('/one-login-returning-claimant/work-email', (req, res) => {
    let workEmail = req.session.data.workEmail
    if (!workEmail) {
      return res.render('one-login-returning-claimant/work-email', {
        error: {
          text: 'Enter your work email address',
          href: '#workEmail'
        },
        data: req.session.data
      })
    }
    const nextStep = (workEmail !== '' && workEmail !== undefined)
        ? '/one-login-returning-claimant/six-digit-passcode'
        : '/work-email'

      res.redirect(nextStep)
  })




  /////////// SIX DIGIT PASSCODE ////////////
  router.post('/one-login-returning-claimant/six-digit-passcode', (req, res) => {
    const sixDigitSecurityCode = req.session.data.sixDigitSecurityCode

    if (!sixDigitSecurityCode) {
      return res.render('one-login-returning-claimant/six-digit-passcode', {
        error: {
          text: 'Enter the 6 digit security code',
          href: '#six-digit-security-code'
        },
        data: req.session.data
      })
    }

    res.redirect('/one-login-returning-claimant/how-we-will-use-your-information');
  })

  router.post('/one-login-returning-claimant/how-we-will-use-your-information', (req, res) => {
    let data = req.session.data
    res.redirect('/one-login-returning-claimant/personal-details') 
  })

  /////////// PERSONAL DETAILS //////////// 
  router.post('/one-login-returning-claimant/personal-details', (req, res) => {
    const data = req.session.data
    const errors = []
    const fieldErrors = {}

    const day = data['returnClaimantDob-day']
    const month = data['returnClaimantDob-month']
    const year = data['returnClaimantDob-year']

    if (!data.returnClaimantFirstName) {
      const message = 'Enter your first name'
      errors.push({ text: message, href: '#return-claimant-first-name' })
      fieldErrors.returnClaimantFirstName = { text: message }
    }

    if (!data.returnClaimantLastName) {
      const message = 'Enter your last name'
      errors.push({ text: message, href: '#return-claimant-last-name' })
      fieldErrors.returnClaimantLastName = { text: message }
    }

    if (!day || !month || !year) {
      const message = 'Enter your full date of birth'
      errors.push({ text: message, href: '#return-claimant-dob' })
      fieldErrors.returnClaimantDob = { text: message }
    }

    if (!data.returnClaimantNationalInsuranceNumber) {
      const message = 'Enter your National Insurance number'
      errors.push({ text: message, href: '#return-claimant-national-insurance-number' })
      fieldErrors.returnClaimantNationalInsuranceNumber = { text: message }
    }

    if (errors.length) {
      return res.render('one-login-returning-claimant/personal-details', {
        errors,
        fieldErrors,
        data
      })
    }

    res.redirect('/one-login-returning-claimant/personal-bank-details')
  })

  /////////// PERSONAL BANK DETAILS ////////////
  router.post('/one-login-returning-claimant/personal-bank-details', (req, res) => {
  const data = req.session.data
  const errors = []
  const fieldErrors = {}

  if (!data.returnClaimantBankAccountName) {
    const message = 'Enter the name on the account'
    errors.push({ text: message, href: '#return-claimant-bank-account-name' })
    fieldErrors.returnClaimantBankAccountName = { text: message }
  }

  if (!data.returnClaimantSortCode) {
    const message = 'Enter a sort code'
    errors.push({ text: message, href: '#return-claimant-sort-code' })
    fieldErrors.returnClaimantSortCode = { text: message }
  }

  if (!data.returnClaimantAccountNumber) {
    const message = 'Enter an account number'
    errors.push({ text: message, href: '#return-claimant-account-number' })
    fieldErrors.returnClaimantAccountNumber = { text: message }
  }

  if (errors.length) {
    return res.render('one-login-returning-claimant/personal-bank-details', {
      errors,
      fieldErrors,
      data
    })
  }
    
    res.redirect('/one-login-returning-claimant/check') // or whatever next step
    
  })


  // GET: Show the CYA page
router.get('/one-login-returning-claimant/check', (req, res) => {
  const data = req.session.data
  res.render('one-login-returning-claimant/check', { data })
})

// POST: Handle confirmation and redirect to success
router.post('/one-login-returning-claimant/check', (req, res) => {
  // Could do something with the data here before redirecting.

  res.redirect('/one-login-returning-claimant/success')
})

  /////////// ONE LOGIN SIGNOUT ////////////
  router.get('/one-login-signout', (req, res) => {
    // Clear the session data
    req.session.destroy(err => {
      if (err) {
        console.error('Session clear error:', err)
      }

      // Optionally, you can also remove the cookie
      res.clearCookie('connect.sid')

      // Render the signed-out confirmation screen
      res.render('one-login-returning-claimant/one-login-signed-out', {})
    })
  })


}