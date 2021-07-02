const mongoose = require('mongoose');

const Sale = mongoose.model('Sale', new mongoose.Schema({
	amount: Number,
	percentage: Number,
	transaction: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Transaction'
  },
}));

module.exports = {
}
