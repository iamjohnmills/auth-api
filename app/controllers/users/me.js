const {validate} = require('../libs/validate');
const {hashPassword} = require('../libs/utilities');
const {getUser,updateUser} = require('../models/user');

const put = async (id,body) => {
  const inputs_validated = await validate([
    { name: 'first_name', value: body.first_name, validations: [{required:true},{maxLength:128}] },
    { name: 'last_name', value: body.last_name, validations: [{required:true},{maxLength:128}] },
    { name: 'pay_to_name', value: body.pay_to_name, validations: [{required:true},{maxLength:128}] },
  ]);
  if(inputs_validated.find(input => input.invalid !== false)){
    return { success: false, message: 'invalid inputs', data: inputs_validated };
  }
	const user_get = await getUser({
		_id: id
	});
	if(!user_get.success){
		return { success: false, message: 'Error getting user.' };
	}
	let user_update;
	user_update = await updateUser({_id: id}, {
		first_name: body.first_name,
		last_name: body.last_name,
		pay_to_name: body.pay_to_name,
	});
	if(!user_update.success){
		return { success: false, message: 'Error saving user.' };
	}
	return { success: true }
}

const get = async (token) => {
	const user_get = await getUser({ _id: token.decoded.id});
	if(!user_get.success){
		return { success: false, message: 'User not found.' };
	}
	user_get.data.password = undefined;
	return user_get;
}

const me = async (options) => {
	const user_get = await get(options.token);
	if(options.method === 'put') {
		const user_update = await put(user_get.data._id,options.body);
		if(!user_update.success) return user_update;
	}
	return user_get;
}

module.exports = me
