const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const https = require('https');
const http = require('http');
const fs = require('fs');
var cors = require('cors');

let appRoutes = require('./routes/app');
let authRoutes = require('./routes/v1/auth');

let app = express();

// environment ==================================================
// Bring environment vars from the '.env' file
let envfile = require('dotenv').config({
  path: path.join(__dirname, '.env')
});

if (envfile.error) {
  console.log('*** ERROR: missing .env file (see README.md)');

  process.exit(1);
}

// Cross-Origin Resource Sharing (CORS) ==========================
var corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// Secure traffic only (HTTPS) ===================================
app.all('*', function (req, res, next) {
  if (req.secure) {
    return next();
  };

  res.redirect('https://' + req.hostname + ':' + httpsPort + req.url);
});

// database ======================================================
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
  useMongoClient: true
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected: ' + process.env.DB_URL);
});

// security ======================================================
// see https://strongloop.com/strongblog/best-practices-for-express-in-production-part-one-security/
app.disable('x-powered-by'); // for better security look into 'helmet' middleware

// passport authentication =======================================
// strategies
const pathPassportLocalStrategy = './authentication/passportLocalStrategy';
const pathPassportLinkedInStrategy = './authentication/passportLinkedInStrategy';
const pathPassportFacebookStrategy = './authentication/passportFacebookStrategy';

require(pathPassportLocalStrategy)(passport);
require(pathPassportLinkedInStrategy)(passport);
require(pathPassportFacebookStrategy)(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// The 'dist' folder holds a production copy of the frontend (for single-place hosting)
app.use(express.static(path.join(__dirname, 'dist')));

// session configuration =========================================
// NOTE: Avoid sessions before setting the static directory or Express will generate
// session requests for static files like images, style sheets, and JS files.
const mongooseConnection = mongoose.createConnection(process.env.DB_URL);
const sessionMongoStore = require('connect-mongo')(session);
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'development secret key',
  cookie: {
    secure: false, //process.env.SESSION_SECURE === "true" ? true : false,
    httpOnly: false
  },
  rolling: true, // Force session cookie to be set on every response. The expiration is reset to the original maxAge.
  resave: true, // Forces the session to be saved back to the session store, even if the session was never modified. 
  saveUninitialized: false,
  store: new sessionMongoStore({
    mongooseConnection: mongooseConnection,
    autoRemove: process.env.SESSION_TTL || 'disabled'
  })
};
if (process.env.SESSION_SECURE) app.set('trust proxy', 1); // trust first proxy
app.use(session(sessionConfig));

// passport init
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes ========================================================

//const httpPort = process.env.HTTP_PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 3443;

app.use('/api/v1/auth', authRoutes);
app.use('/', appRoutes);

// catch 404 and forward to index
app.use(function (req, res) {
  res.redirect('https://' + req.headers.host);
});

// run server ===================================================

// HTTPS
const secureServer = https.createServer({
  key: fs.readFileSync('./authentication/certs/key.pem'),
  cert: fs.readFileSync('./authentication/certs/cert.pem')
}, app).listen(httpsPort, function () {
  console.log('Secure Server listening on port ' + httpsPort);
});

secureServer.on('error', onError);

// HTTP -- un-comment if needed
/* ====
var insecureServer = http.createServer(app).listen(httpPort, function () {
  console.log('Insecure Server listening on port ' + httpPort);
});

insecureServer.on('error', onError);
   ==== */

// HTTP Server Events ============================================
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('*** ERROR: Server failed to start: ' + error.address + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('*** ERROR: Server failed to start: ' + error.address + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}