const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');

const hashPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

const generateCode = (length) => {
  return new Promise( (resolve, reject) => {
    crypto.randomBytes(length, (err,buf) => {
      resolve(buf.toString('hex'));
    });
  });
}

const createToken = (payload,secret,expires) => {
	return jsonwebtoken.sign(payload, secret, { expiresIn: expires });
}

const getToken = (token,secret) => {
  return new Promise(function(resolve, reject) {
    if(!token){
      return resolve({ success: false, token: null, decoded: null, message: 'No token provided.' });
    }
  	jsonwebtoken.verify(token, secret, (err, decoded) => {
      if(err){
        return resolve({ success: false, message: 'Failed to authenticate token.' });
      } else {
        return resolve({ success: true, token: token, decoded: decoded, message: 'Token is valid.' });
      }
  	});
  });
}

module.exports = {
  generateCode,
  hashPassword,
  createToken,
	getToken,
}
