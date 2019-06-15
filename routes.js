'use strict';
const redisCacheMiddleware = require('./middleware/redisCacheMiddleware');
const { check } = require('express-validator/check');


// import controllers
let customerController = require('./controllers/customer');
let departmentController = require('./controllers/department');
let categoryController = require('./controllers/category');
let attributeController = require('./controllers/attribute');
let productController = require('./controllers/product');
let orderController = require('./controllers/order');
let cartController = require('./controllers/cart');
let taxController = require('./controllers/tax');
let regionController = require('./controllers/shipping-region');
let stripeController = require('./controllers/stripe');

// import validators
let customerValidator = require('./validators/customer');
let departmentValidator = require('./validators/department');
let categoryValidator = require('./validators/category');
let attributeValidator = require('./validators/attribute');
let productValidator = require('./validators/product');
let orderValidator = require('./validators/order');
let cartValidator = require('./validators/cart');
let taxValidator = require('./validators/tax');
let regionValidator = require('./validators/shipping-region');
let stripeValidator = require('./validators/stripe');


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

  // Swagger API Docs
  app.route('/docs').get((req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
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
    .get(redisCacheMiddleware, departmentController.index);

  app.route('/departments/:id')
    .get([ redisCacheMiddleware, ...departmentValidator.get() ], departmentController.get);

  // 3. CATEGORIES
  app.route('/categories/inDepartment/:id')
    .get([redisCacheMiddleware, ...categoryValidator.getByDepartment() ], categoryController.getByDepartment);

  app.route('/categories/inProduct/:id')
    .get([ redisCacheMiddleware, ...categoryValidator.getByProduct() ], categoryController.getByProduct);

  app.route('/categories/:id')
    .get([ redisCacheMiddleware, ...categoryValidator.get() ], categoryController.get);
    
  app.route('/categories')
    .get([ redisCacheMiddleware, ...categoryValidator.index() ], categoryController.index);
    
  // 4. ATTRIBUTES
  app.route('/attributes/inProduct/:id')
    .get([ redisCacheMiddleware, ...attributeValidator.getByProduct() ], attributeController.getByProduct);

  app.route('/attributes/values/:id')
    .get([ redisCacheMiddleware, ...attributeValidator.getValues() ], attributeController.getValues);

  app.route('/attributes/:id')
    .get([ redisCacheMiddleware, ...attributeValidator.get() ], attributeController.get);
    
  app.route('/attributes')
    .get(redisCacheMiddleware, attributeController.index);
    
  // 5. PRODUCTS
  app.route('/products/inCategory/:id')
    .get([ redisCacheMiddleware, ...productValidator.getByCategory() ], productController.getByCategory);

  app.route('/products/search')
    .get([ redisCacheMiddleware, ...productValidator.search() ], productController.search);

  app.route('/products/inDepartment/:id')
    .get([ redisCacheMiddleware, ...productValidator.getByDepartment() ], productController.getByDepartment);

  app.route('/products/:id/details')
    .get([ redisCacheMiddleware, ...productValidator.get() ], productController.get);

  app.route('/products/:id/locations')
    .get([ redisCacheMiddleware, ...productValidator.getLocations() ], productController.getLocations);

  app.route('/products/:id/reviews')
    .get([ redisCacheMiddleware, ...productValidator.getReviews() ], productController.getReviews)
    .post([ auth, ...productValidator.newReview() ], productController.newReview);

  app.route('/products/:id')
    .get([ redisCacheMiddleware, ...productValidator.get() ], productController.get);
    
  app.route('/products')
    .get([ redisCacheMiddleware, ...productValidator.index() ], productController.index);

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

  app.route('/orders/inCustomer')
    .get(auth, orderController.index);

  app.route('/orders/shortDetail/:id')
    .get([ auth, ...orderValidator.getShortDetail() ], orderController.getShortDetail);

  app.route('/orders/:id')
    .get([ auth, ...orderValidator.get() ], orderController.get);
  
  // 8. SHOPPING CART
  app.route('/shoppingcart/generateUniqueId')
    .get(cartController.generateUniqueId);

  app.route('/shoppingcart/add')
    .post(cartValidator.add(), cartController.add);

  app.route('/shoppingcart/getSaved/:cart_id')
    .get([ redisCacheMiddleware, ...cartValidator.getSaved() ], cartController.getSaved);

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

  // 9. TAX 
  app.route('/tax')
    .get(redisCacheMiddleware, taxController.index);

  app.route('/tax/:tax_id')
    .get([ redisCacheMiddleware, ...taxValidator.get() ], taxController.get);

  // 10. SHIPPING REGIONS
  app.route('/shipping/regions')
    .get(redisCacheMiddleware, regionController.index);

  app.route('/shipping/regions/:shipping_region_id')
    .get([ redisCacheMiddleware, ...regionValidator.get() ], regionController.get);

  // 11. STRIPE CHARGE
  app.route('/stripe/charge')
    .post([ auth, ...stripeValidator.charge() ], stripeController.charge);

  app.route('/stripe/webhooks')
    .post(stripeController.webhooks);

};