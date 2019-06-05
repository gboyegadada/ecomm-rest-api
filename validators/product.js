const { check } = require('express-validator/check');

module.exports =  {
  get: () => {
    return [
      check('id').isInt({min: 0}).withMessage('The Product ID is not a number.'),
    ];
  },
  
  index: () => {
    return [
      check('page').optional().isInt({min: 0}).withMessage('The page number is invalid.'),
      
      check('limit').optional().isInt({min: 0}).withMessage('The limit number is invalid.'),

      check('description_length').optional().isInt({min: 0}).withMessage('The description_length should be an integer.'),
      
      check('order_by').optional().matches(/^(product_id|name)$/i).withMessage('The field of order_by is not allowed for sorting (allowed: product_id, name).'),
      
      check('order').optional().matches(/^(asc|desc)$/i).withMessage('The field of order is not allowed for sorting (allowed: asc, desc).')
    ];
  },
  
  getByDepartment: () => {
    return [
      check('id').isInt({min: 0}).withMessage('The Department ID is not a number.')
    ];
  },
  
  getByCategory: () => {
    return [
      check('id').isInt({min: 0}).withMessage('The Category ID is not a number.')
    ];
  }
};