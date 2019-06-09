const { check } = require('express-validator/check');

module.exports =  {
  get: () => {
    return [
      check('id').isInt({min: 0}).withMessage('The Category ID is not a number.'),
    ];
  },
  
  index: () => {
    return [
      check('page').optional().isInt({min: 0}).withMessage('The page number is invalid.'),
      
      check('limit').optional().isInt({min: 0}).withMessage('The limit number is invalid.'),
      
      check('order_by').optional().matches(/^(category_id|name)$/i).withMessage('The field of order_by is not allowed for sorting (allowed: category_id, name).'),
      
      check('order').optional().matches(/^(asc|desc)$/i).withMessage('The field of order is not allowed for sorting (allowed: asc, desc).')
    ];
  },
  
  getByDepartment: () => {
    return [
      check('id')
      .exists()
      .isInt({min: 0})
      .withMessage('The Department ID is not a number.')
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