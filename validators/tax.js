const { check } = require('express-validator/check');

module.exports =  {
  get: () => {
    return [
      check('tax_id')
      .exists()
      .isInt({min: 0})
      .withMessage('The Tax ID is not a number.')
    ];
  }
};