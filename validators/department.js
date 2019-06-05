const { check } = require('express-validator/check');

module.exports =  {
  get: () => {
    return [
      check('id').isInt({min: 0}).withMessage('The Department ID is not number.')
    ];
  }
};