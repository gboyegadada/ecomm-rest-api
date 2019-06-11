const { check } = require('express-validator/check');
let Order = require('../repositories/order');
let validateCurrencyCode = require('validate-currency-code');

module.exports =  {
  charge: () => {
    return [
      check('stripeToken')
      .exists()
      .isString()
      .withMessage('The field stripeToken is required.'),

      check('order_id')
        .exists()
        .isInt({min: 0}).withMessage('The Order ID is not a number.')
        .custom(value => {
          return Order.exists(value).then(exists => {
            if (!exists) return Promise.reject('The Order ID does not exist.');
          })
        }).withMessage('The Order ID does not exist.'),

        check('description')
        .exists()
        .isString()
        .withMessage('The field description is required.'),

        check('amount')
        .exists().withMessage('The field amount is required.')
        .isInt().withMessage('The field amount is not an integer.'),

        check('currency')
        .optional()
        .custom(value => {
          return new Promise((res, reject) => validateCurrencyCode(`${value}`.toUpperCase()) ? res(true) : reject(false));
        })
        .withMessage('The field currency is invalid.')
    ];
  }
};