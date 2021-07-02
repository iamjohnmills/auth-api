const mongoose = require('mongoose');

const Resident = mongoose.model('Resident', new mongoose.Schema({
  first_name: String,
  last_name: String,
	email: String,
	phone: String,
	status: Number, // active | expired
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  invoices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  }],
}));

module.exports = {
}
