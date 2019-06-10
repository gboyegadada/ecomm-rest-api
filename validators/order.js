const { check } = require('express-validator/check');

module.exports =  {
  get: () => {
    return [
      check('id')
      .exists()
      .isInt({min: 0})
      .withMessage('The Order ID is not a number.')
    ];
  }, 

  getShortDetail: () => {
    return [
      check('id')
      .exists()
      .isInt({min: 0})
      .withMessage('The Order ID is not a number.')
    ];
  },

  create: () => {
    return [
      check('cart_id')
          .exists()
          .isString()
          .isLength({min: 2})
          .withMessage('The Cart ID should be a unique string.'), 

      check('shipping_id')
          .exists()
          .isInt({min: 0})
          .withMessage('The Shipping ID is not a number.'), 

      check('tax_id')
          .exists()
          .isInt({min: 0})
          .withMessage('The Tax ID is not a number.'), 
    ];
  },
};