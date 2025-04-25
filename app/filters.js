//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here
addFilter('statusColour', status => {
  switch(status) {
    case 'In progress':
      return 'govuk-tag--purple'
    case 'Not started':
      return 'govuk-tag--red'
    case 'Complete':
      return 'govuk-tag--green'
  }
})

