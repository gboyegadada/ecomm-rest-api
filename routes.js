'use strict';
let jwt = require('express-jwt'); // for authentication with Auth0 JWT's
const { check } = require('express-validator/check');

// import controllers
let customerController = require('./controllers/customer');
let departmentController = require('./controllers/department');
let categoryController = require('./controllers/category');
let attributeController = require('./controllers/attribute');
let productController = require('./controllers/product');
let orderController = require('./controllers/order');
let cartController = require('./controllers/cart');

// import validators
let customerValidator = require('./validators/customer');
let departmentValidator = require('./validators/department');
let categoryValidator = require('./validators/category');
let attributeValidator = require('./validators/attribute');
let productValidator = require('./validators/product');
let orderValidator = require('./validators/order');
let cartValidator = require('./validators/cart');


// auth0 JWT; reject requests that aren't authorized
// client ID and secret should be stored in a .env file
let auth = require('express-jwt')({
  secret: process.env.AUTH0_SECRET,
  audience: process.env.AUTH0_ID,
  getToken: (req) => {
    if (req.headers['user-key'] && req.headers['user-key'].split(' ')[0] === 'Bearer') {
        return req.headers['user-key'].split(' ')[1];
    } 
    
    return null;
  }
});

// export route generating function
module.exports = app => {

  // "Hello, World!" route
  app.route('/').get((req, res) => {
    res.json({
      message: `This is the ${process.env.APP} REST API`
    });
  });

  // 1. AUTH
  app.route('/customers')
    .post(customerValidator.signUp(), customerController.signUp);

  app.route('/customers/login')
    .post(customerValidator.login(), customerController.login);

  app.route('/customers/facebook')
    .post(customerValidator.loginWithFacebook(), customerController.loginWithFacebook);

  // 2. DEPARTMENTS 
  app.route('/departments')
    .get(departmentController.index);

  app.route('/departments/:id')
    .get(departmentValidator.get(), departmentController.get);

  // 3. CATEGORIES
  app.route('/categories/inDepartment/:id')
    .get(categoryValidator.getByDepartment(), categoryController.getByDepartment);

  app.route('/categories/inProduct/:id')
    .get(categoryValidator.getByProduct(), categoryController.getByProduct);

  app.route('/categories/:id')
    .get(categoryValidator.get(), categoryController.get);
    
  app.route('/categories')
    .get(categoryValidator.index(), categoryController.index);
    
  // 4. ATTRIBUTES
  app.route('/attributes/inProduct/:id')
    .get(attributeValidator.getByProduct(), attributeController.getByProduct);

  app.route('/attributes/values/:id')
    .get(attributeValidator.getValues(), attributeController.getValues);

  app.route('/attributes/:id')
    .get(attributeValidator.get(), attributeController.get);
    
  app.route('/attributes')
    .get(attributeController.index);
    
  // 5. PRODUCTS
  app.route('/products/inCategory/:id')
    .get(productValidator.getByCategory(), productController.getByCategory);

  app.route('/products/inDepartment/:id')
    .get(productValidator.getByDepartment(), productController.getByDepartment);

  app.route('/products/:id/details')
    .get(productValidator.get(), productController.get);

  app.route('/products/:id/locations')
    .get(productValidator.getLocations(), productController.getLocations);

  app.route('/products/:id/reviews')
    .get(productValidator.getReviews(), productController.getReviews)
    .post([ auth, ...productValidator.newReview() ], productController.newReview);

  app.route('/products/:id')
    .get(productValidator.get(), productController.get);
    
  app.route('/products')
    .get(productValidator.index(), productController.index);

  // 6. CUSTOMERS
  app.route('/customer')
    .get(auth, customerController.getProfile)
    .put([ auth, ...customerValidator.updateProfile() ], customerController.updateProfile);

  app.route('/customers/address')
    .put([ auth, ...customerValidator.updateAddress() ], customerController.updateAddress);

  app.route('/customers/creditCard')
    .put([ auth, ...customerValidator.updateCreditCard() ], customerController.updateCreditCard);
  
  // 7. ORDERS
  app.route('/orders')
    .post([ auth, ...orderValidator.create() ], orderController.create);

  app.route('/orders/:id')
    .get([ auth, ...orderValidator.get() ], orderController.get);

  app.route('/orders/inCustomer/:id')
    .get([ auth, ...orderValidator.index() ], orderController.index);

  app.route('/orders/shortDetail/:id')
    .get([ auth, ...orderValidator.getShortDetail() ], orderController.getShortDetail);
  
  // 8. SHOPPING CART
  app.route('/shoppingcart/generateUniqueId')
    .get(cartController.generateUniqueId);

  app.route('/shoppingcart/add')
    .post(cartValidator.add(), cartController.add);

  app.route('/shoppingcart/getSaved/:cart_id')
    .get(cartValidator.getSaved(), cartController.getSaved);

  app.route('/shoppingcart/update/:item_id')
    .put(cartValidator.update(), cartController.update);
    
  app.route('/shoppingcart/moveToCart/:item_id')
    .get(cartValidator.moveToCart(), cartController.moveToCart);
    
  app.route('/shoppingcart/saveForLater/:item_id')
    .get(cartValidator.saveForLater(), cartController.saveForLater);
    
  app.route('/shoppingcart/removeProduct/:item_id')
    .delete(cartValidator.removeItem(), cartController.removeItem);
    
  app.route('/shoppingcart/totalAmount/:cart_id')
    .get(cartValidator.getTotalAmount(), cartController.getTotalAmount);

  app.route('/shoppingcart/:cart_id')
    .get(cartValidator.get(), cartController.getItems)
    .delete(cartValidator.empty(), cartController.empty);

};