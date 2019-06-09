let Customer = require('../repositories/customer');
let filter = require('express-validator/filter');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let { doFacebookAuth } = require('../handlers/fb-auth');

// import Error classes
let RouteNotFoundError = require('../errors/route-not-found');
let ValidationError = require('../errors/validation-error');
let AuthenticationError = require('../errors/authentication-error');


// Define private helper functions
let maskCreditCardNum = (credit_card) => {
  if (!credit_card) return null;

  let cc = `${credit_card}`;
  let cb = (m, $1, $2) => (new Array($1.length + 1).join("X")) + $2;

  return cc.length > 4 ? cc.replace(/^(.*)([\d]{4})$/g, cb) : null;
}

let sanitizeCustomerProfile = (customer) => {
  delete customer.password;
  customer.credit_card = maskCreditCardNum(customer.credit_card);

  return customer;
}

let formatResponseObject = (customer) => {
  // create a JWT
  let token = jwt.sign({ id: customer.customer_id, email: customer.email }, process.env.AUTH0_SECRET, {
    expiresIn: '24h',
    audience: process.env.AUTH0_ID
  });

  return {
    "customer": {
      "schema": sanitizeCustomerProfile(customer)
    },
    "accessToken": `Bearer ${token}`,
    "expires_in": "24h"
  }
}


// Define controller actions...
module.exports = {
  signUp: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      const { name, email, password } = filter.matchedData(req, {locations: ['body']});

      Customer.create({
        name, 
        email, 
        password
      })
      .then(customer => customer 
        ? res.json(formatResponseObject(customer)) 
        : next(new RouteNotFoundError('Customer record not found.'))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },

  login: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      const { email, password } = filter.matchedData(req, {locations: ['body']});

      Customer.findOneBy({ email })
      .then(customer => {
        return bcrypt
        .compare(password, customer.password)
        .then(authenticated => authenticated 
              ? res.json(formatResponseObject(customer))
              : next(new AuthenticationError('Email or Password is invalid.', { param: 'password', code: 'USR_01' }))
        )
      })
      .catch(next);
    } else {
      next(new AuthenticationError('Email or Password is invalid.', { param: 'email', code: 'USR_01' }));
    }
  },

  loginWithFacebook: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      const { access_token } = filter.matchedData(req, {locations: ['body']});

      doFacebookAuth(access_token)
      .then(fbres => Customer.findOneBy({ email: fbres.email }))
      .then(customer => {
        return customer 
              ? res.json(formatResponseObject(customer))
              : next(new AuthenticationError('User not registered.', { param: 'access_token', code: 'USR_01' }))
      })
      .catch(next);
    } else {
      next(new AuthenticationError('Missing access token.', { param: 'access_token', code: 'USR_01' }));
    }
  },

  getProfile: (req, res, next) => {
    Customer.find(req.user.id)
    .then(sanitizeCustomerProfile)
    .then(customer => customer 
      ? res.json(customer) 
      : next(new RouteNotFoundError('Customer record not found.'))
    )
    .catch(next);
  },

  updateProfile: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      let params = filter.matchedData(req, {locations: ['body']});

      Customer.update(req.user.id, params)
      .then(sanitizeCustomerProfile)
      .then(customer => customer 
        ? res.json(customer) 
        : next(new RouteNotFoundError('Customer record not found.'))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },

  updateAddress: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      let params = filter.matchedData(req, {locations: ['body']});

      Customer.update(req.user.id, params)
      .then(sanitizeCustomerProfile)
      .then(customer => customer 
        ? res.json(customer) 
        : next(new RouteNotFoundError('Customer record not found.'))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },

  updateCreditCard: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      let params = filter.matchedData(req, {locations: ['body']});

      Customer.update(req.user.id, params)
      .then(sanitizeCustomerProfile)
      .then(customer => customer 
        ? res.json(customer) 
        : next(new RouteNotFoundError('Customer record not found.'))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  }
};

