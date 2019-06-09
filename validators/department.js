const { check } = require('express-validator/check');

module.exports =  {
  get: () => {
    return [
      check('id')
      .exists()
      .isInt({min: 0})
      .withMessage('The Department ID is not a number.')
    ];
  }
};