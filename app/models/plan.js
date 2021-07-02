const mongoose = require('mongoose');

const Plan = mongoose.model('Plan', new mongoose.Schema({
	name: String,
	transaction_percentage: Number,
	maximum_properties: Number,
}));

module.exports = {
}
