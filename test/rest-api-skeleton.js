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

 

  describe('Error Handling Middleware', function() {

    it('returns 404 error for an unknown route', function(done) {
      request(app).get('/unimplemented')
        .set('Authorization', `Bearer ${token}`)
        .expect(404, {
          name: 'RouteNotFoundError',
          message: 'You have tried to access an API endpoint (/unimplemented) that does not exist.'
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