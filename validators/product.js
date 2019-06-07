const { check } = require('express-validator/check');
let Product = require('../repositories/product');

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
  },
  
  getLocations: () => {
    return [
      check('id').isInt({min: 0}).withMessage('The Product ID is not a number.')
    ];
  },
  
  getReviews: () => {
    return [
      check('id').isInt({min: 0}).withMessage('The Product ID is not a number.')
    ];
  },
  
  newReview: () => {
    return [
      check('id')
        .isInt({min: 0}).withMessage('The Product ID is not a number.')
        .custom(value => {
          return Product.find(value).then(product => {
            if (null === product) return Promise.reject('The Product ID does not exist.');
          })
        }).withMessage('The Product ID does not exist.'),
      
      check('review').isLength({min: 3}).withMessage('Review should more that 3 characterts long.'), 
      
      check('rating').isInt({min: 0, max: 10}).withMessage('Rating should be between 0 and 10.')
    ];
  }
};