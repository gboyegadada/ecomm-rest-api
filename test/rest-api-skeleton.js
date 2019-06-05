// import libraries
let request  = require('supertest');
let expect   = require('chai').expect;
let jwt      = require('jsonwebtoken');
let chalk    = require('chalk');
let random   = require('randomstring');
let _        = require('lodash');

// load the config
require('dotenv').config();

const DEBUG = false;

// load the server
let app = require('../server');

// create a JWT
let token = jwt.sign({ user: 'some.body@example.com' }, process.env.AUTH0_SECRET, {
    expiresIn: '5s',
    audience: process.env.AUTH0_ID
});

// load the data generator
let dg = require('./data-generator');

// utility function for turning BSON into JSON
let unBSON = bson => JSON.parse(JSON.stringify(bson));

describe(`The ${process.env.APP} REST API`, function() {

  // create a variable to keep track of items added/removed from the database
  let doc_stats = {};
  this.timeout(0);

  // setup
  before(function(done) {
    dg.generate((counts) => {
      doc_stats = counts;
      done();
    });
  });

  // teardown
  after(function() {
    // remove all documents from the database
    
  });

  it('can blow smoke', function() {
    expect(true).to.be.true;
  });

  /*
  describe('JWT Middleware', function() {

    it('returns 401 error without a proper Authorization header', function(done) {
      request(app).get('/users')
        .expect(401, { name: 'UnauthorizedError',
          message: 'No authorization token was found',
          code: 'credentials_required',
          status: 401,
          inner: {
            message: 'No authorization token was found'
          }
        }, done);
    });

    it('returns 200 if valid Authorization header sent', function(done) {
      request(app).get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200, [], done);
    });

    it('returns 401 error if the token is expired', function(done) {
      // create a short-lived JWT
      let t = jwt.sign({ user: 'some.body@example.com' }, process.env.AUTH0_SECRET, {
          expiresIn: '10', // 10ms
          audience: process.env.AUTH0_ID
        });
      // wait 50ms before we try to use it
      setTimeout(function() {
        request(app).get('/users')
          .set('Authorization', `Bearer ${t}`)
          .expect(401, done);
      }, 50);
    });
  });
  */

  describe('Error Handling Middleware', function() {

    it('returns 404 error for an unknown route', function(done) {
      request(app).get('/unimplemented')
        .set('Authorization', `Bearer ${token}`)
        .expect(404, { 
          error: {
            status: 404,
            code: 'RouteNotFoundError',
            field: null,
            message: 'You have tried to access an API endpoint (/unimplemented) that does not exist.'
          }
        }, done);
    });
  });

  describe('Routes', function() {

    // set up the DB with test fixtures
    before(function(done) {
      done();
    });

    // remove all of the test data
    after(function(done) {
      done();
    });

    // get a list of all defined routes
    let routes = app._router.stack.filter(r => 'undefined' !== typeof r.route).map(r => r.route);

    // create a describe block for each model
  });
});