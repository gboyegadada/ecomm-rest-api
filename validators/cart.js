const { check } = require('express-validator/check');
let Cart = require('../repositories/cart');
let Product = require('../repositories/product');

module.exports =  {

  get: () => {
    return [
      check('cart_id')
      .exists()
      .isString()
      .isLength({min: 2})
      .withMessage('The Cart ID should be a unique string.')
    ];
  }, 

  getSaved: () => {
    return [
      check('cart_id')
      .exists()
      .isString()
      .isLength({min: 2})
      .withMessage('The Cart ID should be a unique string.')
    ];
  }, 

  add: () => {
    return [
      check('cart_id')
          .exists()
          .isString()
          .isLength({min: 2})
          .withMessage('The Cart ID should be a unique string.'), 

      check('product_id')
          .exists()
          .isInt({min: 0}).withMessage('The Product ID is not a number.')
          .custom(value => {
            return Product.find(value).then(product => {
              if (null === product) return Promise.reject('The Product ID does not exist.');
            })
          }), 

      check('attributes')
          .exists()
          .isString()
          .isLength({min: 1})
          .withMessage('The field attribute cannot be empty.'), 
    ];
  },

  update: () => {
    return [
      check('item_id')
          .exists()
          .isInt({min: 0}).withMessage('The Item ID is not a number.')
          .custom(value => {
            return Cart.exists(value).then(exists => {
              if (!exists) return Promise.reject('The Item ID does not exist.');
            })
          }), 

      check('quantity')
          .exists()
          .isInt({min: 0}).withMessage('The quantity is not a number.'),
    ];
  },

  moveToCart: () => {
    return [
      check('item_id')
          .exists()
          .isInt({min: 0}).withMessage('The Item ID is not a number.')
          .custom(value => {
            return Cart.exists(value).then(exists => {
              if (!exists) return Promise.reject('The Item ID does not exist.');
            })
          })
    ];
  },

  saveForLater: () => {
    return [
      check('item_id')
          .exists()
          .isInt({min: 0}).withMessage('The Item ID is not a number.')
          .custom(value => {
            return Cart.exists(value).then(exists => {
              if (!exists) return Promise.reject('The Item ID does not exist.');
            })
          })
    ];
  },

  removeItem: () => {
    return [
      check('item_id')
          .exists()
          .isInt({min: 0}).withMessage('The Item ID is not a number.')
    ];
  },

  empty: () => {
    return [
      check('cart_id')
      .exists()
      .isString()
      .isLength({min: 2})
      .withMessage('The Cart ID should be a unique string.')
    ];
  }, 

  getTotalAmount: () => {
    return [
      check('cart_id')
      .exists()
      .isString()
      .isLength({min: 2})
      .withMessage('The Cart ID should be a unique string.')
    ];
  }

};