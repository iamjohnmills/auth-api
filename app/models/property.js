const mongoose = require('mongoose');

const Property = mongoose.model('Property', new mongoose.Schema({
  address: String,
  city: String,
	state: String,
	zip: String,
  status: String, // active | inactive
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  residents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident'
  }],
  invoices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
}));

module.exports = {
}
