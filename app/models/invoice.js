const mongoose = require('mongoose');

const Invoice = mongoose.model('Invoice', new mongoose.Schema({
	amount: Number,
	name: String,
	template: {
		title: String,
		help_text: String,
	},
	status: String, // open | closed | pending
	reason: String, // failed | due | pastdue | paid | waived
	archived: Boolean,
	date_due: String,
	code: String,
	notes: String,
	emails: String,
	user: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'User'
  },
	resident: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Resident'
  },
	property: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Property'
  },
	transaction: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Transaction'
  },
}));

module.exports = {
}
