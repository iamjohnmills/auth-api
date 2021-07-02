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
  //console.log(await meta.find(route => req.originalUrl.startsWith(route.name) && route.auth))
  if(!auth_required) return next();
  const provided_token = req.body.token || req.params.token || req.headers['x-access-token'];
  req.token = await getToken(provided_token,access_token_secret);
  if(!req.token.success) return res.status(403).send(req.token);
  return next();
});


// Default route
router.get('/', (req, res) => {
	return res.json({ success: true, message: 'Welcome to my API!' });
});


// Testing Routes
// Useful for testing and clearing out the database. Remove for production.
router.get('/deleteusers', async (req, res) => {
  const {deleteUsers} = require('./models/user');
  return res.json( await deleteUsers() );
});


// Auth routes
router.post('/refresh_token', async (req, res) => {
  const refreshtoken = require('./controllers/auth/refreshtoken');
  if(!req.cookies.refresh_token) return res.json({ success: false, message: 'No refresh token provided.' })
  const refresh_token_response = await getToken(req.cookies.refresh_token.token, refresh_token_secret);
  if(!refresh_token_response.success) return res.status(403).send(refresh_token_response);
  const response = await refreshtoken(refresh_token_response.decoded.id);
  if(!response.success){
    return res.json(response);
  }
  res.cookie('refresh_token', response.data.refresh_token, { httpOnly: true, secure: false, maxAge: response.data.refresh_token.expires * 1000 }); //secure: true, SameSite: 'strict'
  return res.json( { success: true, data: { access_token: response.data.access_token } });
});

router.post('/login', async (req, res) => {
  const login = require('./controllers/auth/login');
  const response = await login(req.body);
  if(!response.success) return res.json(response);
  res.cookie('refresh_token', response.data.refresh_token, { httpOnly: true, secure: false, maxAge: response.data.refresh_token.expires * 1000 }); // httpOnly: true, secure: true, SameSite: 'strict'
  return res.json( { success: true, data: { access_token: response.data.access_token } });
});

router.post('/register', async (req, res) => {
  const register = require('./controllers/auth/register');
  return res.json( await register(req.body) );
});

router.post('/activate', async (req, res) => {
  const activate = require('./controllers/auth/activate');
  return res.json( await activate(req.body) );
});

router.post('/forgotpassword', async (req, res) => {
  const forgotpassword = require('./controllers/auth/forgotpassword');
  return res.json( await forgotpassword(req.body) );
});

router.post('/resetpassword', async (req, res) => {
  const resetpassword = require('./controllers/auth/resetpassword');
  return res.json( await resetpassword(req.body) );
});

router.get('/me', async (req, res) => {
  const me = require('./controllers/users/me');
  return res.json( await me({ method: 'get', token: req.token }) );
});

router.post('/emailchange', async (req, res) => {
  const emailchange = require('./controllers/auth/emailchange');
  return res.json( await emailchange({ token: req.token, body: req.body}) );
});

router.post('/activate/emailchange', async (req, res) => {
  const emailchange = require('./controllers/auth/emailchange');
  return res.json( await emailchange({ body: req.body}) );
});

router.post('/passwordchange', async (req, res) => {
  const passwordchange = require('./controllers/auth/passwordchange');
  return res.json( await passwordchange({ token: req.token, body: req.body}) );
});


// User routes
router.put('/me', async (req, res) => {
  const me = require('./controllers/users/me');
  return res.json( await me({ method: 'put', token: req.token, body: req.body }) );
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
