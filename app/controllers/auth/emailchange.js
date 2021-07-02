const {validate} = require('../../libs/validate');
const {generateCode,hashPassword} = require('../../libs/utilities');
const {getUser,updateUser} = require('../../models/user');
const {verify_expiration} = require('../../config');
const {sendmail} = require('../../libs/email');

const activate = async (options) => {
	const user_get = await getUser({
		activation_code: options.body.activation_code,
		activation_expiration: { $gt: Date.now() }
	});
	if(!user_get.success){
		return { success: false, message: 'Error looking up activation code.' };
	}
	let user_update;
	user_update = await updateUser({_id: user_get.data._id}, { $set: { email: user_get.data.email_change }, $unset: { activation_code: 1, activation_expiration: 1 } } );
	if(!user_update.success){
		return { success: false, message: 'Error updating user.' };
	}
	return { success: true };
}

const change = async (options) => {
  const inputs_validated = await validate([
    { name: 'new_email', value: options.body.new_email, validations: [{required:true},{maxLength:128},{email:true}] },
    { name: 'password', value: options.body.password, validations: [{required:true},{maxLength:128}] },
  ]);
  if(inputs_validated.find(input => input.invalid !== false)){
    return { success: false, message: 'invalid inputs', data: inputs_validated };
  }
	const user_get = await getUser({ _id: options.token.decoded.id});
	if(!user_get.success){
		return { success: false, message: 'User not found.' };
	}
	const hashed_password = await hashPassword(options.body.password);
	if(user_get.data.password !== hashed_password){
		return { success: false, message: 'Password is incorrect.' };
	}
	const user_exists = await getUser({
		email: options.body.new_email
	});
	if(user_exists.success){
		return { success: false, message: 'Email is already in use.' };
	}
	const activation_code = await generateCode(3);
	let user_update;
	user_update = await updateUser({_id: user_get.data._id}, {
    email_change: options.body.new_email,
		activation_code: activation_code,
    activation_expiration: Date.now() + verify_expiration,
	});
	if(!user_update.success){
		return { success: false, message: 'Email not updated. Error saving user.' };
	}
  const email = await sendmail({
    template: 'template_user_verify_email_change',
    tags: {
			activation_code: activation_code,
    },
    to: options.body.new_email,
  });
	if(!email.success){
  	user_update = await updateUser({_id: user_get.data._id},{
      $unset: { email_change: 1, activation_code: 1, activation_expiration: 1 },
  	});
		if(!user_update.success){
			return { success: false, message: 'Email not updated. Error reverting user after email send failure.' };
		}
		return { success: false, message: 'Email not updated. Error sending activation link.' };
	}
	return { success: true };
}

const emailchange = async (options) => {
  console.log(options)
  if(options.body.activation_code){
    return activate(options);
  } else {
    return change(options);
  }
}

module.exports = emailchange
