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



  /////////// ONE LOGIN SIGNED IN AND ID TRIAGE FLOW ////////////
  router.post('/one-login-returning-claimant/one-login-signed-in', (req, res) => {
    let data = req.session.data

    res.redirect('/one-login-returning-claimant/triage/do-you-live-in-the-uk')

  })


  router.post('/one-login-returning-claimant/triage/do-you-live-in-the-uk', (req, res) => {
    let liveInTheUK = req.session.data.liveInTheUK
    if (liveInTheUK === 'Yes') {
      // User lives in the UK
       res.redirect('/one-login-returning-claimant/triage/do-you-live-in-the-uk')
    } else {
      // User does not live in the UK
       res.redirect('/one-login-returning-claimant/triage/types-of-identification')
    }
  })


  router.post('/one-login-returning-claimant/triage/types-of-identification', (req, res) => {
    let typesOfIdentification = req.session.data.typesOfIdentification
    if (typesOfIdentification === 'Yes') {
      res.redirect('/one-login-returning-claimant/triage/types-of-identification')
    } else {
      res.redirect('/one-login-returning-claimant/triage/prove-id-at-post-office')
    }
  })


  router.post('/one-login-returning-claimant/triage/prove-id-at-post-office', (req, res) => {
    let proveAtPostOffice = req.session.data.proveAtPostOffice
    if (proveAtPostOffice === 'Yes') {
      res.redirect('/one-login-returning-claimant/triage/prove-id-at-post-office')
    } else {
      res.redirect('/one-login-returning-claimant/triage/prove-id-at-bank')

    }
  })


  router.post('/one-login-returning-claimant/triage/prove-id-at-bank', (req, res) => {
    let proveAtPostOffice = req.session.data.proveAtPostOffice
    if (proveAtPostOffice === 'Yes') {
      res.redirect('/one-login-returning-claimant/triage/prove-id-at-bank')
    } else {
      res.redirect('/one-login-returning-claimant/find-another-way')

    }
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
    if (choice === 'goToService') {
      res.redirect('/one-login-returning-claimant/confirm-college-email');
    } else {
      res.redirect('https://govuk-one-login-prototype-6d2545e2d700.herokuapp.com/page-index/authentication/create-account');
    }
  })



  /////////// CONFIRM COLLEGE WORK EMAIL ACCOUNT ////////////
  router.post('/one-login-returning-claimant/confirm-college-email', (req, res) => {
    const hasWorkEmail = req.session.data.hasWorkEmail
    
    if (!hasWorkEmail) {
      return res.render('one-login-returning-claimant/confirm-college-email', {
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



  //////// WHAT IS YOUR NAME ////////////
  router.post('/one-login-returning-claimant/what-is-your-name', (req, res) => {
    // Store names individually in session
    req.session.data.returnClaimantFirstName = req.body.returnClaimantFirstName
    req.session.data.returnClaimantMiddleName = req.body.returnClaimantMiddleName
    req.session.data.returnClaimantLastName = req.body.returnClaimantLastName

    // Optional: store a full name string if needed elsewhere
    const fullName = [
      req.body.returnClaimantFirstName,
      req.body.returnClaimantMiddleName,
      req.body.returnClaimantLastName
    ].filter(Boolean).join(' ')

    req.session.data.claimantName = fullName

    res.redirect('/one-login-returning-claimant/does-employer-use-any-other-name')
  })



  //////// DOES EMPLOYER USE ANY OTHER NAME ////////////

  router.post('/one-login-returning-claimant/does-employer-use-any-other-name', (req, res) => {
    const doesEmployerUseAnyOtherName = req.body.doesEmployerUseAnyOtherName
    req.session.data.doesEmployerUseAnyOtherName = doesEmployerUseAnyOtherName

    if (doesEmployerUseAnyOtherName === 'Yes') {
      res.redirect('/one-login-returning-claimant/enter-any-other-name')
    } else {
      res.redirect('/one-login-returning-claimant/personal-details')
    }
  })

  //////// ENTER ANY OTHER NAME ////////////
  router.post('/one-login-returning-claimant/enter-any-other-name', (req, res) => {
  req.session.data.enterAliasFirstName = req.body.enterAliasFirstName
  req.session.data.enterAliasMiddleName = req.body.enterAliasMiddleName
  req.session.data.enterAliasLastName = req.body.enterAliasLastName

  // Optional: store alias full name if you want to reuse it
  const aliasFullName = [
    req.body.enterAliasFirstName,
    req.body.enterAliasMiddleName,
    req.body.enterAliasLastName
  ].filter(Boolean).join(' ')

    req.session.data.aliasFullName = aliasFullName

    res.redirect('/one-login-returning-claimant/personal-details')
  })




  /////////// PERSONAL DETAILS //////////// 
  router.post('/one-login-returning-claimant/personal-details', (req, res) => {
  // Store DOB components individually
  req.session.data['returnClaimantDob-day'] = req.body['returnClaimantDob-day']
  req.session.data['returnClaimantDob-month'] = req.body['returnClaimantDob-month']
  req.session.data['returnClaimantDob-year'] = req.body['returnClaimantDob-year']

  // Optionally store a full DOB string (ISO-style for sorting, etc.)
  req.session.data.returnClaimantDobFormatted = [
    req.body['returnClaimantDob-year'],
    req.body['returnClaimantDob-month'],
    req.body['returnClaimantDob-day']
  ].join('-')

    // Store NI number
    req.session.data.returnClaimantNationalInsuranceNumber = req.body.returnClaimantNationalInsuranceNumber

    res.redirect('/one-login-returning-claimant/personal-bank-details')
  })


  /////////// PERSONAL BANK DETAILS ////////////
router.post('/one-login-returning-claimant/personal-bank-details', (req, res) => {
  const data = req.session.data
  const errors = []
  const fieldErrors = {}

  const correctName = 'Nathan Harper'
  const correctSortCode = '112233'
  const correctAccountNumber = '12345678'

  // Step 1: Required field validation
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

  // If any required fields are missing, return immediately
  if (errors.length > 0) {
    return res.render('one-login-returning-claimant/personal-bank-details', {
      errors,
      fieldErrors,
      data
    })
  }

  // Step 2: Field-level correctness check
  const incorrectFields = []

  if (data.returnClaimantBankAccountName !== correctName) {
    incorrectFields.push({
      field: 'returnClaimantBankAccountName',
      message: 'Name on the account doesn’t match what we expect',
      href: '#return-claimant-bank-account-name'
    })
  }

  if (data.returnClaimantSortCode !== correctSortCode) {
    incorrectFields.push({
      field: 'returnClaimantSortCode',
      message: 'Sort code doesn’t match what we expect',
      href: '#return-claimant-sort-code'
    })
  }

  if (data.returnClaimantAccountNumber !== correctAccountNumber) {
    incorrectFields.push({
      field: 'returnClaimantAccountNumber',
      message: 'Account number doesn’t match what we expect',
      href: '#return-claimant-account-number'
    })
  }

  const isCorrect = incorrectFields.length === 0

  // Step 3: Attempt logic
  if (!data.bankAttemptCount) {
    data.bankAttemptCount = 0
  }

  if (isCorrect) {
    data.bankAttemptCount = 0
    data.bankDetailsError = false
    return res.redirect('/one-login-returning-claimant/check')
  } else {
    data.bankAttemptCount += 1
    data.bankDetailsError = true

    if (data.bankAttemptCount >= 3) {
      return res.redirect('/one-login-returning-claimant/check')
    } else {
      // Populate fieldErrors and errors based on incorrect fields
      incorrectFields.forEach(({ field, message, href }) => {
        fieldErrors[field] = { text: message }
        errors.push({ text: message, href })
      })

      return res.render('one-login-returning-claimant/personal-bank-details', {
        errors,
        fieldErrors,
        data
      })
    }
  }
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