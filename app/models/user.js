const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  email_change: String,
	password: String,
  first_name: String,
  last_name: String,
  activation_code: String,
  activation_expiration: Date,
  reset_code: String,
  reset_expiration: Date,
  last_login: Date,
	status: String, // active | pending_email_verification
  role: String, // admin | user
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
