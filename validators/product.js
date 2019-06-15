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
      check('page').optional().isInt({min: 1}).withMessage('The page number is invalid.'),
      
      check('limit').optional().isInt({min: 1}).withMessage('The limit number is invalid.'),

      check('description_length').optional().isInt({min: 20}).withMessage('The description_length should be an integer.'),
      
      check('order_by').optional().matches(/^(product_id|name)$/i).withMessage('The field of order_by is not allowed for sorting (allowed: product_id, name).'),
      
      check('order').optional().matches(/^(asc|desc)$/i).withMessage('The field of order is not allowed for sorting (allowed: asc, desc).')
    ];
  },
  
  search: () => {
    return [
      check('query_string').exists().isLength({min: 1}).withMessage('Please specify a search query.'),
      
      check('all_words').optional().matches(/^(on|off)$/i).withMessage('The field of all_words but be set to: on | off.'),

      check('page').optional().isInt({min: 1}).withMessage('The page number is invalid.'),
      
      check('limit').optional().isInt({min: 1}).withMessage('The limit number is invalid.'),

      check('description_length').optional().isInt({min: 20}).withMessage('The description_length should be an integer.')
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
  
  getByCategory: () => {
    return [
      check('id')
      .exists()
      .isInt({min: 0})
      .withMessage('The Category ID is not a number.')
    ];
  },
  
  getLocations: () => {
    return [
      check('id')
      .exists()
      .isInt({min: 0})
      .withMessage('The Product ID is not a number.')
    ];
  },
  
  getReviews: () => {
    return [
      check('id')
      .exists()
      .isInt({min: 0})
      .withMessage('The Product ID is not a number.')
    ];
  },
  
  newReview: () => {
    return [
      check('id')
        .exists()
        .isInt({min: 0}).withMessage('The Product ID is not a number.')
        .custom(value => {
          return Product.find(value).then(product => {
            if (null === product) return Promise.reject('The Product ID does not exist.');
          })
        }).withMessage('The Product ID does not exist.'),
      
      check('review').exists().isLength({min: 3}).withMessage('Review should more that 3 characterts long.'), 
      
      check('rating').exists().isInt({min: 0, max: 10}).withMessage('Rating should be between 0 and 10.')
    ];
  }
};