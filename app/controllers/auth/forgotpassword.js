const {validate} = require('../../libs/validate');
const {getUser,updateUser} = require('../../models/user');
const {generateCode} = require('../../libs/utilities');
const {verify_expiration} = require('../../config');
const {sendmail} = require('../../libs/email');

const forgotpassword = async (body) => {
  const inputs_validated = await validate([
    { name: 'email', value: body.email, validations: [{required:true},{maxLength:128},{email:true}] },
  ]);
  if(inputs_validated.find(input => input.invalid !== false)){
    return { success: false, message: 'invalid inputs', data: inputs_validated };
  }
	const user_get = await getUser({
		email: body.email
	});
	if(!user_get.success){
		return { success: false, message: 'User not found.' };
	}
	let user_update;
	const reset_code = await generateCode(3);
	user_update = await updateUser({_id: user_get.data._id},{
		reset_code: reset_code,
		reset_expiration: Date.now() + verify_expiration
	});
	if(!user_update.success){
		return { success: false, message: 'Error saving reset code.'}
	}
  const email = await sendmail({
    template: 'template_user_reset_password',
    tags: {
			reset_code: reset_code,
    },
    to: body.email,
  });
	if(!email.success){
		user_update = await updateUser({_id: user_get.data._id}, {$unset: { reset_code: 1, reset_expiration: 1 } } );
		if(!user_update.success){
			return { success: false, message: 'Error updating user after email send failure.' };
		}
		return { success: false, message: 'Error sending reset password link.' };
	}
	return { success: true };
}

module.exports = forgotpassword
