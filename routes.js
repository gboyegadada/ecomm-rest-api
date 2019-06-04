'use strict';
let jwt = require('express-jwt'); // for authentication with Auth0 JWT's
// import controllers
let customerController = require('./controllers/customer');

// import validators
let customerValidator = require('./validators/customer');


// auth0 JWT; reject requests that aren't authorized
// client ID and secret should be stored in a .env file
let auth = require('express-jwt')({
  secret: process.env.AUTH0_SECRET,
  audience: process.env.AUTH0_ID
});

// export route generating function
module.exports = app => {

  // "Hello, World!" route
  app.route('/').get((req, res) => {
    res.json({
      message: `This is the ${process.env.APP} REST API`
    });
  });

  app.route('/customers')
    .post(customerValidator.signUp(), customerController.signUp);
};