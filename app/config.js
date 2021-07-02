if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
module.exports = {
  base_url: process.env.NODE_ENV === 'development' ? process.env.BASE_URL_DEVELOPMENT : process.env.BASE_URL_PRODUCTION,
  frontend_url: process.env.NODE_ENV === 'development' ? process.env.FRONTEND_URL_DEVELOPMENT : process.env.FRONTEND_URL_PRODUCTION,
	product_name: process.env.PRODUCT_NAME,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_life: Number(process.env.ACCESS_TOKEN_LIFE),
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_life: Number(process.env.REFRESH_TOKEN_LIFE),
	database: process.env.MONGO_DB,
  verify_expiration: Number(process.env.VERIFY_EXPIRATION),
  email_settings: {
    reply: process.env.EMAIL_REPLY,
    host: process.env.EMAIL_HOST_DEV,
    port: process.env.EMAIL_PORT_DEV,
    user: process.env.EMAIL_USER_DEV,
    pass: process.env.EMAIL_PASS_DEV,
  }
};
