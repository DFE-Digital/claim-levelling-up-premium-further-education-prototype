//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Status tag colour
addFilter('statusColour', status => {
  switch(status) {
    case 'In progress':
      return 'govuk-tag--yellow'
    case 'Not started':
      return 'govuk-tag--red'
    case 'Verified':
      return 'govuk-tag--green'
  }
})



