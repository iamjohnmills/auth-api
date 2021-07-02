//const {validate} = require('../libs/validate');
//const {getUser,updateUser} = require('../models/users');

const getInvoice = async (invoice_id) => {
  /*
  const inputs_validated = await validate([
    { name: 'invoice_id', value: invoice_id, validations: [{required:true}] },
  ]);
  if(inputs_validated.find(input => input.invalid !== false)){
    return { success: false, message: 'invalid inputs', data: inputs_validated };
  }
  */
  const sample = {
    invoice_id: invoice_id,
    amount: '$1,200',
    name: 'April 2021 Rent',
    status: 'unpaid', // unpaid, pending, confirm, paid, failed
    collector: {
      name: 'Coolguy Properties, LLC',
      phone: '(414 123-4567)',
      email: 'collector@email.com',
    },
    resident: {
      first_name: 'Kind',
      last_name: 'Lady',
      phone: '(414 123-4567)',
      email: 'kindlady@email.com',
    },
    property: {
      unit: 'A1208',
      address: '1234 Cool Street',
      city: 'Milwaukee',
      state: 'WI',
      zip: '53202',
    }
  }
	return { success: true, data: sample };
}

module.exports = getInvoice
