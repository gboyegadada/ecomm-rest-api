'use strict';
let jwt = require('express-jwt'); // for authentication with Auth0 JWT's
const { check } = require('express-validator/check');

// import controllers
let customerController = require('./controllers/customer');
let departmentController = require('./controllers/department');
let categoryController = require('./controllers/category');

// import validators
let customerValidator = require('./validators/customer');
let departmentValidator = require('./validators/department');
let categoryValidator = require('./validators/category');


// auth0 JWT; reject requests that aren't authorized
// client ID and secret should be stored in a .env file
let auth = require('express-jwt')({
  secret: process.env.AUTH0_SECRET,
  audience: process.env.AUTH0_ID
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

};