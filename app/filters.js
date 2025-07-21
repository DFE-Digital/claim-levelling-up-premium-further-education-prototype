//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Status tag colour
addFilter('statusColour', status => {

  console.log('Status tag:', status)

  switch(status) {
    case 'In progress':
      return 'govuk-tag--yellow'
    case 'Not started':
      return 'govuk-tag--red'
    case 'Approved':
      return 'govuk-tag--green'
    case 'Rejected':
      return 'govuk-tag--red'
    case 'Pending':
      return 'govuk-tag--yellow'
    case 'Overdue':
      return 'govuk-tag--blue'
  }
})


// Find a specific error object by field name (used in templates)
addFilter('findError', function(errors, fieldName) {
  const error = errors && errors.find(error => error.href === `#${fieldName}`)
  return error ? { text: error.text } : null
})
