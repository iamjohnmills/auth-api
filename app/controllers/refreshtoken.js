const {validate} = require('../libs/validate');
const {createToken} = require('../libs/utilities');
const {getUser} = require('../models/users');
const {access_token_secret,access_token_life,refresh_token_secret,refresh_token_life} = require('../config');

const refreshtoken = async (id) => {
	const user_get = await getUser({
		_id: id
	});
	if(!user_get.success){
		return { success: false, message: 'User not found.' };
	}
	const new_access_token = await createToken({ id: user_get.data._id },access_token_secret,access_token_life);
	const new_refresh_token = await createToken({ id: user_get.data._id },refresh_token_secret,refresh_token_life);
	return { success: true, data: { access_token: { token: new_access_token, expires: access_token_life}, refresh_token: { token: new_refresh_token, expires: refresh_token_life } } };
}

module.exports = refreshtoken
