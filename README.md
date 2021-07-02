# About
A light-weight API workflow for authentication using Node.js, Express, MongoDB, Nodemailer, and JWTs

## Additional Setup
- I use the official MongoDB service: https://www.mongodb.com
- I use mailtrap.io for email settings: https://mailtrap.io
  - Frontend URLs are included in the links sent via email. I get the activation/reset codes from the raw text within Mailtrap, and use Insomnia to test them: https://insomnia.rest
- .env file SECRET should be some long string: I generate mine using node's crypto.randomBytes.
  - Example: ```require('crypto').randomBytes(48, function(err, buffer) {
  var token = buffer.toString('hex');
});```

## Setup .env file
Add or edit your .env with the following:

```PORT=8081
BASE_URL_DEVELOPMENT=http://localhost
BASE_URL_PRODUCTION=https://api.auth.app
FRONTEND_URL_DEVELOPMENT=http://localhost:8080
FRONTEND_URL_PRODUCTION=https://auth.app

ACCESS_TOKEN_SECRET=[SECRET]
ACCESS_TOKEN_LIFE=120

REFRESH_TOKEN_SECRET=[SECRET]
REFRESH_TOKEN_LIFE=86400

PRODUCT_NAME=Auth.app

MONGO_DB=[MONGO_DB_URL]

VERIFY_EXPIRATION=86400000

EMAIL_REPLY=noreply@whatever.com
EMAIL_HOST_DEV=smtp.mailtrap.io
EMAIL_PORT_DEV=2525
EMAIL_USER_DEV=[USER]
EMAIL_PASS_DEV=[PASSWORD]```

## Install
`npm install`

## Run development instance
`npm run dev`
