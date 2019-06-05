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

describe(`Test customer authentication routes:`, function() {

  // create a variable to keep track of items added/removed from the database
  let doc_stats = {};
  this.timeout('60s');

  // setup
  before(function(done) {

  });

  // teardown
  after(function() {
    // remove all documents from the database
    
  });

  describe('1. Customer Sign Up', function() {

    it('returns 401 error without a proper Authorization header', function(done) {
      request(app).post('/customers')
        .set('Accept', 'application/json')
        .send({
          "name": "Ben Affleck",
          "email": "thebatman@testgmail.com",
          "password": "secret"
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          assert(res.body.customer.schema.name, 'Ben Affleck');
          assert(res.body.customer.schema.email, 'thebatman@testgmail.com');
          assert(res.body.expires_in, '24h');
          assert.isNotEmpty(res.body.accessToken);

          done();
        });
    });

    it('returns 200 if valid Authorization header sent', function(done) {
      request(app).get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200, [], done);
    });
  });

});