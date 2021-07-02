const {validate} = require('../libs/validate');
const {generateCode,hashPassword} = require('../libs/utilities');
const {getUser,saveUser,deleteUser} = require('../models/users');
const {verify_expiration} = require('../config');
const {sendmail} = require('../libs/email');

const register = async (body) => {
  const inputs_validated = await validate([
    { name: 'email', value: body.email, validations: [{required:true},{maxLength:128},{email:true}] },
    { name: 'password', value: body.password, validations: [{required:true},{maxLength:128}] },
    { name: 'first_name', value: body.first_name, validations: [{required:true},{maxLength:128}] },
    { name: 'last_name', value: body.last_name, validations: [{required:true},{maxLength:128}] },
  ]);
  if(inputs_validated.find(input => input.invalid !== false)){
    return { success: false, message: 'invalid inputs', data: inputs_validated };
  }
	const user_get = await getUser({
		email: body.email
	});
	if(user_get.success){
		return { success: false, message: 'Email is already in use.' };
	}
	const activation_code = await generateCode(3);
	let user_update;
	user_update = await saveUser({
		email: body.email,
		password: hashPassword(body.password),
		activation_code: activation_code,
    activation_expiration: Date.now() + verify_expiration,
		first_name: body.first_name,
		last_name: body.last_name,
		status: 'pending_email_verification',
		role: 'customer',
	});
	if(!user_update.success){
		return { success: false, message: 'Error saving user.' };
	}
  const email = await sendmail({
    template: 'template_user_verify_email',
    tags: {
			activation_code: activation_code,
    },
    to: body.email,
  });
	if(!email.success){
		user_update = await deleteUser(user_update.data._id);
		if(!user_update.success){
			return { success: false, message: 'Error deleting user after email send failure.' };
		}
		return { success: false, message: 'Error sending activation link.' };
	}
	return { success: true };
}

module.exports = register
