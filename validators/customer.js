const { check } = require('express-validator/check');
let Customer = require('../repositories/customer');

module.exports =  {
  signUp: () => {
    return [
      check('name', `The 'name' field is required.`)
          .isLength({ min: 5 }).withMessage('Name should be at least 3 characters long')
          .isLength({ max: 50 }).withMessage(`This is too long <name>`),

      check('email', `The 'email' field is required.`)
          .isEmail().withMessage('The email is invalid')
          .custom(value => {
            return Customer.findOneBy({ email: value }).then(customer => {
              if (customer) return Promise.reject('The email already exists.');
            })
          }).withMessage('The email already exists.'),

      check('password')
          .isLength({ min: 8 }).withMessage('must be at least 5 chars long')
          .isLength({ max: 50 }).withMessage(`This is too long <name>`)
          .matches(/\d/).withMessage('must contain a number')
    ];
  },
  
  login: () => {
    return [
      check('email', `The 'email' field is required.`)
          .isEmail().withMessage('The email is invalid')
          .custom(value => {
            return Customer.findOneBy({ email: value }).then(customer => {
              if (!customer) return Promise.reject('The email doesn\'t exist.');
            })
          }).withMessage('The email doesn\'t exist.'),

      check('password', `The 'password' field is required.`)
          .isLength({ min: 3 })
    ];
  }
};