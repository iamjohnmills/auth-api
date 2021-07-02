const {validate} = require('../libs/validate');
const {getUser,updateUser} = require('../models/users');

const activate = async (body) => {
  const inputs_validated = await validate([
    { name: 'activation_code', value: body.activation_code, validations: [{required:true}] },
  ]);
  if(inputs_validated.find(input => input.invalid !== false)){
    return { success: false, message: 'invalid inputs', data: inputs_validated };
  }
	const user_get = await getUser({
		activation_code: body.activation_code,
		activation_expiration: { $gt: Date.now() }
	});
	if(!user_get.success){
		return { success: false, message: 'Error looking up activation code.' };
	}
	let user_update;
	user_update = await updateUser({_id: user_get.data._id}, { $set: {status: 'active'}, $unset: { activation_code: 1, activation_expiration: 1 } } );
	if(!user_update.success){
		return { success: false, message: 'Error updating user.' };
	}
  /*
	user_update = await updateUser({_id: user_get.data._id},{
		status: 'active'
	});
	if(!user_update.success){
		return { success: false, message: 'Error activating acount.' };
	}
  */
	return { success: true };
}

module.exports = activate
