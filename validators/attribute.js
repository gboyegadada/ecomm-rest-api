const { check } = require('express-validator/check');

module.exports =  {
  get: () => {
    return [
      check('id').isInt({min: 0}).withMessage('The Attribute ID is not a number.'),
    ];
  },
  
  getValues: () => {
    return [
      check('id')
      .exists()
      .isInt({min: 0})
      .withMessage('The Value ID is not a number.')
    ];
  },
  
  getByProduct: () => {
    return [
      check('id')
      .exists()
      .isInt({min: 0})
      .withMessage('The Product ID is not a number.')
    ];
  }
};