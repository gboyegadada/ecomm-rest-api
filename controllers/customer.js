let Customer = require('../repositories/customer');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');
let ValidationError = require('../errors/validation-error');
let jwt = require('jsonwebtoken');

let formatResponseObject = (customer) => {
  delete customer.password;
  
  // create a JWT
  let token = jwt.sign({ user: customer.email }, process.env.AUTH0_SECRET, {
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
      }, customer => res.json(formatResponseObject(customer)), next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  }
};

