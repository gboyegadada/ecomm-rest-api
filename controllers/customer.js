let Customer = require('../repositories/customer');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');
let ValidationError = require('../errors/validation-error');
let AuthenticationError = require('../errors/authentication-error');
const bcrypt = require('bcrypt');

// import Error classes
let RouteNotFoundError = require('../errors/route-not-found');

let jwt = require('jsonwebtoken');

let formatResponseObject = (customer) => {
  delete customer.password;
  
  // create a JWT
  let token = jwt.sign({ id: customer.customer_id, email: customer.email }, process.env.AUTH0_SECRET, {
    expiresIn: '24h',
    audience: process.env.AUTH0_ID
  });

  return {
    "customer": {
      "schema": customer
    },
    "accessToken": `Bearer ${token}`,
    "expires_in": "24h"
  }
}

module.exports = {
  signUp: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      const { name, email, password } = req.body; 

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
      const { email, password } = req.body; 

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
  }
};

