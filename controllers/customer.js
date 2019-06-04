let Customer = require('../repositories/customer');
let validationHandler = require('../handlers/validationHandler');
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
    req
    .getValidationResult() // From validator middleware...
    .then(validationHandler())   
    .then(() => { 
      const { name, email, password } = req.body; 

      Customer.create({
        name, 
        email, 
        password
      }, customer => res.json(formatResponseObject(customer)), next);
    })
    .catch(next)
  }
};

