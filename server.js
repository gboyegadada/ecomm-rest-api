// import libraries
let exp = require('express');     // to set up an express app
let bp  = require('body-parser'); // for parsing JSON in request bodies
let helmet = require('helmet'); // For header security
let compression = require('compression')
let rateLimiterMiddleware = require('./middleware/rateLimiterMiddleware');

// import Error classes
// NOTE: UnauthorizedError is built into express-jwt
let BadRequestError    = require('./errors/bad-request');
let ForbiddenError     = require('./errors/forbidden');
let RouteNotFoundError = require('./errors/route-not-found');

// load environment variables
require('dotenv').config();

// initialize app
let app = exp();
app.use('/docs', exp.static('dist'));

let swagger = require('swagger-node-express');

// Couple the application to the Swagger module.
swagger.setAppHandler(app);

/**
 * Preflight Middleware
 */
// Rate limiter middleware to prevent DDoS (enable in ** PRODUCTION **)
if ('production' === process.env.NODE_ENV) {
  app.use(rateLimiterMiddleware);
}

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200);
  }
  else {
    next();
  }
});

// To help protect your app from some well-known web vulnerabilities 
// by setting HTTP headers appropriately
app.use(helmet());

// parse JSON in the body of requests
app.use(bp.json());

// for parsing application/x-www-form-urlencoded
app.use(bp.urlencoded({ extended: true })); 

// Use gzip compression
app.use(compression());

/**
 * Routes
 */
let routes = require('./routes');
routes(app);

/**
 * Postflight Middleware
 */
// handle 404's
app.use((req, res, next) => {
  next(new RouteNotFoundError(`You have tried to access an API endpoint (${req.url}) that does not exist.`));
});

// handle errors (404 is not technically an error)
app.use((err, req, res, next) => {
  switch(err.name) {
    case 'BadRequestError':
      res.status(400).json({ error: { status: 400, code: err.name, message: err.message, field: null } });
      break;
    case 'UnauthorizedError':
      res.status(401).json({ error: { status: 401, code: 'AUT_02', message: 'Access Unauthorized', field: null } });
      break;
    case 'ForbiddenError':
      res.status(403).json({ error: { status: 403, code: err.name, message: err.message, field: null } });
      break;
    case 'RouteNotFoundError':
      res.status(404).json({ error: { status: 404, code: err.name, message: err.message, field: null } });
      break;
    case 'RecordNotFoundError':
      res.status(404).json({ error: { status: 404, code: err.extra.code, message: err.message, field: err.extra.param } });
      break;
    case 'ValidationError':
      res.status(400).json({ error: { status: 400, code: err.extra.code, message: err.message, field: err.extra.param } });
      break;
    case 'AuthenticationError':
      res.status(401).json({ error: { status: 401, code: err.extra.code, message: err.message, field: err.extra.param } });
      break;
    default:
      res.status(400).json({ error: { status: 400, code: err.name, message: err.message, field: null } });
  }
});

// export for testing
module.exports = app;