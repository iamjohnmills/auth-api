const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  email_change: String,
	password: String,
  first_name: String,
  last_name: String,
  pay_to_name: String,
  stripe_api_key: String,
  activation_code: String,
  activation_expiration: Date,
  reset_code: String,
  reset_expiration: Date,
  last_login: Date,
	status: String, // active | pending_email_verification | pending_stripe_integration | stripe_authentication_failed | pending_properties | pending_residents | delete
  role: String, // admin | customer
  plan: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Plan'
  }
}));

// FOR TESTING ONLY
const deleteUsers = (options={}) => {
	const response_db = new Promise( (resolve, reject) => {
		User.deleteMany(options, (err,response) => {
			if(err) return resolve({ success: false, error: err });
			return resolve({ success: true, data: response });
		});
	});
	return response_db;
}
// FOR TESTING ONLY

const getUser = (get) => {
	return new Promise( (resolve, reject) => {
	  User.findOne(get, (err, response) => {
			if(err) return resolve({ success: false, error: err });
			if(!response) return resolve({ success: false });
			return resolve({ success: true, data: response });
		});
	});
}

const updateUser = (get, set) => {
	return new Promise( (resolve, reject) => {
		User.updateOne(get, set, (err, count) => {
			if(err) return resolve({ success: false, error: err });
			return resolve({ success: true });
		});
	});
}

const saveUser = (set) => {
	return new Promise( (resolve, reject) => {
		new User(set).save( (err,response) => {
			if(err) return resolve({ success: false, error: err });
			return resolve({ success: true, data: response });
		});
	});
}

const deleteUser = (id) => {
	return new Promise( (resolve, reject) => {
		new User({ _id: id }).deleteOne( (err,response) => {
			if(err) return resolve({ success: false, error: err });
			return resolve({ success: true });
		});
	});
}

module.exports = {
	deleteUsers,
	getUser,
	updateUser,
	saveUser,
	deleteUser,
}
