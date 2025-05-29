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
    case 'Dfe approved':
      return 'govuk-tag--green'
    case 'Dfe rejected':
      return 'govuk-tag--red'
    case 'Dfe pending':
      return 'govuk-tag--grey'
  }
})

// Find a specific error object by field name (used in templates)
addFilter('findError', function(errors, fieldName) {
  const error = errors && errors.find(error => error.href === `#${fieldName}`)
  return error ? { text: error.text } : null
})
