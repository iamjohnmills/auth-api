const {validate} = require('../libs/validate');
const {hashPassword} = require('../libs/utilities');
const {getUser,updateUser} = require('../models/user');

const passwordchange = async (options) => {
  const inputs_validated = await validate([
    { name: 'password', value: options.body.password, validations: [{required:true},{maxLength:128}] },
    { name: 'confirm_password', value: options.body.confirm_password, validations: [{required:true},{maxLength:128}] },
  ]);
  if(inputs_validated.find(input => input.invalid !== false)){
    return { success: false, message: 'invalid inputs', data: inputs_validated };
  }
	const user_get = await getUser({ _id: options.token.decoded.id});
	if(!user_get.success){
		return { success: false, message: 'User not found.' };
	}
	const hashed_password = await hashPassword(options.body.password);
	const hashed_confirm_password = await hashPassword(options.body.confirm_password);
	if(hashed_password !== hashed_confirm_password){
		return { success: false, message: 'Confirm Password must match Password.' };
	}
	let user_update;
	user_update = await updateUser({_id: user_get.data._id}, {
		password: hashed_password,
	});
	if(!user_update.success){
		return { success: false, message: 'Password not updated. Error saving user.' };
	}
	return { success: true };
}

module.exports = passwordchange
