const { check } = require('express-validator/check');

module.exports =  {
  get: () => {
    return [
      check('shipping_region_id')
      .exists()
      .isInt({min: 0})
      .withMessage('The Shipping Region ID is not a number.')
    ];
  }
};