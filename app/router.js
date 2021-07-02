// Include Express Router and CORs
const express = require('express');
const cors = require('cors')
const router = express.Router();

// Include config and utilties for tokens
const {frontend_url,access_token_secret,access_token_life,refresh_token_secret} = require('./config');
const {getToken} = require('./libs/utilities');

// Route Metadata
const meta = [
  { name: '/', auth: false },
  { name: '/register', auth: false },
  { name: '/activate', auth: false },
  { name: '/login', auth: false },
  { name: '/resetpassword', auth: false },
  { name: '/forgotpassword', auth: false },
  { name: '/refresh_token', auth: false },
  { name: '/emailchange', auth: true },
  { name: '/activate/emailchange', auth: false },
  { name: '/passwordchange', auth: true },
  { name: '/me', auth: true },
  { name: '/invoice', auth: false },
]

// Setup Router: Parse Requests Into JSON
const bodyparser = require('body-parser');
router.use(bodyparser.urlencoded({extended: false}));
router.use(bodyparser.json());

// Setup Router: Parse cookies
const cookieparser = require('cookie-parser')
router.use(cookieparser())

// Setup Router: Log Requests to Console
const morgan = require('morgan');
router.use(morgan('dev'));

// Setup Router: CORS Middleware
router.use(cors({
  origin: frontend_url,
  credentials: true
}));

// Setup Router: Authentication Middleware
router.use( async (req, res, next) => {
  const auth_required = await meta.find(route => req.originalUrl.startsWith(route.name) && route.auth);
  console.log(await meta.find(route => req.originalUrl.startsWith(route.name) && route.auth))
  if(!auth_required) return next();
  const provided_token = req.body.token || req.params.token || req.headers['x-access-token'];
  req.token = await getToken(provided_token,access_token_secret);
  if(!req.token.success) return res.status(403).send(req.token);
  return next();
});

// Main controller index for the all routes
const controllers = require('./controllers/index');

// ROUTES FOR TESTING ONLY
router.get('/deleteusers', async (req, res) => {
  return res.json( await controllers.testing.deleteusers() );
});

router.get('/', (req, res) => {
	return res.json({ success: true, message: 'Welcome to my API!' });
});

router.post('/refresh_token', async (req, res) => {
  if(!req.cookies.refresh_token) return res.json({ success: false, message: 'No refresh token provided.' })
  const refresh_token_response = await getToken(req.cookies.refresh_token.token, refresh_token_secret);
  if(!refresh_token_response.success) return res.status(403).send(refresh_token_response);
  const response = await controllers.refreshtoken(refresh_token_response.decoded.id);
  if(!response.success){
    return res.json(response);
  }
  res.cookie('refresh_token', response.data.refresh_token, { httpOnly: true, secure: false, maxAge: response.data.refresh_token.expires * 1000 }); //secure: true, SameSite: 'strict'
  return res.json( { success: true, data: { access_token: response.data.access_token } });
});

router.post('/login', async (req, res) => {
  const response = await controllers.login(req.body);
  if(!response.success) return res.json(response);
  res.cookie('refresh_token', response.data.refresh_token, { httpOnly: true, secure: false, maxAge: response.data.refresh_token.expires * 1000 }); // httpOnly: true, secure: true, SameSite: 'strict'
  return res.json( { success: true, data: { access_token: response.data.access_token } });
});

router.post('/register', async (req, res) => {
  return res.json( await controllers.register(req.body) );
});

router.post('/activate', async (req, res) => {
  return res.json( await controllers.activate(req.body) );
});

router.post('/forgotpassword', async (req, res) => {
  return res.json( await controllers.forgotpassword(req.body) );
});

router.post('/resetpassword', async (req, res) => {
  return res.json( await controllers.resetpassword(req.body) );
});

router.get('/me', async (req, res) => {
  return res.json( await controllers.me({ method: 'get', token: req.token }) );
});

router.put('/me', async (req, res) => {
  return res.json( await controllers.me({ method: 'put', token: req.token, body: req.body }) );
});

router.post('/emailchange', async (req, res) => {
  return res.json( await controllers.emailchange({ token: req.token, body: req.body}) );
});

router.post('/activate/emailchange', async (req, res) => {
  return res.json( await controllers.emailchange({ body: req.body}) );
});

router.post('/passwordchange', async (req, res) => {
  console.log(req.token)
  return res.json( await controllers.passwordchange({ token: req.token, body: req.body}) );
});


router.get('/invoice/:invoice_id', async (req, res) => {
  return res.json( await controllers.getInvoice(req.params.invoice_id) );
});


// Implement Error Routes
const notFound = (req, res) => {
	return res.json({ message: 'Route not found', method: req.method, url: req.originalUrl });
}
router.get('*', notFound);
router.post('*', notFound);
router.put('*', notFound);
router.delete('*', notFound);

module.exports = router;
