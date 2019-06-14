const { check } = require('express-validator/check');
const { getCode } = require('country-list');
const db = require('../services/db');
let Customer = require('../repositories/customer');

module.exports =  {
  signUp: () => {
    return [
      check('name', `The 'name' field is required.`)
          .exists()
          .isLength({ min: 5 }).withMessage('Name should be at least 3 characters long')
          .isLength({ max: 50 }).withMessage(`This is too long <name>`),

      check('email', `The 'email' field is required.`)
          .exists()
          .isEmail().withMessage('The email is invalid')
          .custom(value => {
            return Customer.findOneBy({ email: value }).then(customer => {
              if (customer) return Promise.reject('The email already exists.');
            })
          }).withMessage('The email already exists.'),

      check('password')
          .exists()
          .isLength({ min: 8 }).withMessage('must be at least 5 chars long')
          .isLength({ max: 50 }).withMessage(`This is too long <name>`)
          .matches(/\d/).withMessage('must contain a number'), 
          
      check('shipping_region_id')
          .optional()
          .isInt({min: 0})
          .withMessage('The Shipping Region ID is not a number.'), 
          
      check('credit_card')
          .optional()
          .isCreditCard()
          .withMessage('This is an invalid Credit Card.'), 
          
      check('day_phone')
          .optional()
          .isMobilePhone()
          .withMessage('This is an invalid phone number.'), 
          
      check('eve_phone')
          .optional()
          .isMobilePhone()
          .withMessage('This is an invalid phone number.'), 
          
      check('mob_phone')
          .optional()
          .isMobilePhone()
          .withMessage('This is an invalid phone number.')
    ];
  },
  
  login: () => {
    return [
      check('email', `The 'email' field is required.`)
          .exists()
          .isEmail().withMessage('The email is invalid')
          .custom(value => {
            return Customer.findOneBy({ email: value }).then(customer => {
              if (!customer) return Promise.reject('The email doesn\'t exist.');
            })
          }).withMessage('The email doesn\'t exist.'),

      check('password', `The 'password' field is required.`)
          .exists()
          .isLength({ min: 3 })
    ];
  },
  
  loginWithFacebook: () => {
    return [
      check('access_token', `The 'access_token' field is required.`)
          .exists()
          .isString()
    ];
  },

  updateProfile: () => {
    return [
      check('name', `The 'name' field is required.`)
          .exists()
          .isLength({ min: 5 }).withMessage('Name should be at least 3 characters long')
          .isLength({ max: 50 }).withMessage(`This is too long <name>`),

      check('email', `The 'email' field is required.`)
          .exists()
          .isEmail().withMessage('The email is invalid')
          .custom((value, {req}) => {
            return Customer.findOneBy({ email: value }).then(customer => {
              if (customer && parseInt(customer.customer_id) !== parseInt(req.user.id)) {
                return Promise.reject('The email already exists.');
              }
            })
          }).withMessage('The email already exists.'),

      check('password')
          .optional()
          .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
          .isLength({ max: 50 }).withMessage(`This is too long <name>`)
          .matches(/\d/).withMessage('must contain a number'), 
          
      check('day_phone')
          .optional()
          .isMobilePhone()
          .withMessage('This is an invalid phone number.'), 
          
      check('eve_phone')
          .optional()
          .isMobilePhone()
          .withMessage('This is an invalid phone number.'), 
          
      check('mob_phone')
          .optional()
          .isMobilePhone()
          .withMessage('This is an invalid phone number.')
    ];
  },

  updateAddress: () => {
    return [
      check('address_1')
          .exists()
          .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
          .withMessage('This is an invalid address.'), 

      check('address_2')
          .optional()
          .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
          .withMessage('This is an invalid address.'), 

      check('city')
          .exists()
          .isLength({ min: 2 }).withMessage('must be at least 2 chars long')
          .withMessage('This is an invalid city.'),  

      check('region')
          .exists()
          .isLength({ min: 2 }).withMessage('must be at least 2 chars long')
          .withMessage('This is an invalid city.'),  

      check('postal_code')
          .exists()
          .isPostalCode('US')
          .withMessage('This is an invalid postal code.'),   

      check('country')
          .exists()
          .custom(value => undefined === getCode(value))
          .withMessage('This is an invalid country.'), 

      check('shipping_region_id')
          .exists()
          .isInt()
          .custom(value => {
            return db('shipping_region')
              .where('shipping_region_id', parseInt(value))
              .then(rows => {
                if (rows.length === 0) return Promise.reject('Shipping region is invalid.');
              })
          })
          .withMessage('Shipping region is invalid.'), 
    ];
  },

  updateCreditCard: () => {
    return [
      check('credit_card')
          .exists()
          .isCreditCard()
          .withMessage('Invalid credit card number.')
    ];
  }
};