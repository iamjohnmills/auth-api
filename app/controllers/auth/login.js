const {validate} = require('../../libs/validate');
const {hashPassword,createToken} = require('../../libs/utilities');
const {getUser,updateUser} = require('../../models/user');
const {access_token_secret,access_token_life,refresh_token_secret,refresh_token_life} = require('../../config');

const login = async (body) => {
  const inputs_validated = await validate([
    { name: 'email', value: body.email, validations: [{required:true},{maxLength:128},{email:true}] },
    { name: 'password', value: body.password, validations: [{required:true},{maxLength:128}] },
  ]);
  if(inputs_validated.find(input => input.invalid !== false)){
    return { success: false, message: 'invalid inputs', data: inputs_validated };
  }
	const user_get = await getUser({
		email: body.email,
	});
	if(!user_get.success){
		return { success: false, message: 'User not found.' };
	}
	if(user_get.data.status === 'pending_email_verification'){
		return { success: false, message: 'Email verification required.' };
	}
	const hashed_password = await hashPassword(body.password);
	if(user_get.data.password !== hashed_password){
		return { success: false, message: 'Password is incorrect.' };
	}
	let user_update;
	user_update = await updateUser({_id: user_get.data._id},{
		last_login: Date.now()
	});
	if(!user_update.success){
		return { success: false, message: 'Error updating user.' };
	}
	const access_token = await createToken({ id: user_get.data._id },access_token_secret,access_token_life);
	const refresh_token = await createToken({ id: user_get.data._id },refresh_token_secret,refresh_token_life);
	return { success: true, data: { access_token: { token: access_token, expires: access_token_life}, refresh_token: { token: refresh_token, expires: refresh_token_life } } };
}

module.exports = login
