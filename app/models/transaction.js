const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction', new mongoose.Schema({
	stripe_id: String,
	date_created: String,
	date_updated: String,
	status: String, // pending | success | failed
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
	invoice: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Invoice'
  },
}));

module.exports = {
}
