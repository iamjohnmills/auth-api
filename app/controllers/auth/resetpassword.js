const {validate} = require('../libs/validate');
const {getUser,updateUser} = require('../models/user');
const {hashPassword} = require('../libs/utilities');

const resetpassword = async (body) => {
  const inputs_validated = await validate([
    { name: 'reset_code', value: body.reset_code, validations: [{required:true}] },
    { name: 'password', value: body.password, validations: [{required:true},{maxLength:128}] },
  ]);
  if(inputs_validated.find(input => input.invalid !== false)){
    return { success: false, message: 'invalid inputs', data: inputs_validated };
  }
	let user_get;
	user_get = await getUser({
		reset_code: body.reset_code,
		reset_expiration: { $gt: Date.now() }
	});
	if(!user_get.success){
		return { success: false, message: 'User not found.' };
	}
	let user_update;
	user_update = await updateUser({_id: user_get.data._id}, { $set: { password: hashPassword(body.password) },$unset: { reset_code: 1, reset_expiration: 1 } } );
	if(!user_update.success){
		return { success: false, message: 'Error setting user password.' };
	}
	return { success: true };
}

module.exports = resetpassword
