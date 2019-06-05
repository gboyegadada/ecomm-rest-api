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

describe(`Test /customers authentication routes:`, function() {

  this.timeout('60s');

  // setup
  before(function(done) {
    done();
  });

  // teardown
  after(function(done) {
    done();
  });

  describe('1. Customer Sign Up', function() {

    let sameEmail = "the.bat.man.457.968.768@testgmail.com";

    it('returns 200 "OK" when name, email and password are provided', function(done) {
      let data = {
        "name": "Ben Affleck",
        "email": sameEmail,
        "password": "secret89"
      };

      request(app).post('/customers')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.customer.schema.name).to.be.equal(data.name);
          expect(res.body.customer.schema.email).to.be.equal(data.email);
          expect(res.body.expires_in).to.be.equal('24h');
          expect(res.body).to.have.property('accessToken');

          done();
        }, done);
    });

    
    it('returns 400 "Bad Request" when email is taken', function(done) {
      let data = {
        "name": "Ben Affleck Jr",
        "email": sameEmail,
        "password": "secret8909"
      };

      request(app).post('/customers')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(res => {
          expect(res.body).to.have.property('error');
          expect(res.body.error.status).to.eq(400);
          expect(res.body.error.code).to.be.oneOf(['USR_02', 'USR_04', 'USR_03', 'USR_06', 'USR_08', 'USR_09']);

          done();
        }, done);
    });

  });

  describe('2. Customer Login', function() {

    let sameEmail = "the.bat.man.457.968.768@testgmail.com";

    it('returns 200 "OK" when email and password are valid', function(done) {
      let data = {
        "email": sameEmail,
        "password": "secret89"
      };

      request(app).post('/customers/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.customer.schema.email).to.be.equal(data.email);
          expect(res.body.expires_in).to.be.equal('24h');
          expect(res.body).to.have.property('accessToken');

          done();
        }, done);
    });

    
    it('returns 401 "Unauthorized" when login fails', function(done) {
      let data = {
        "email": sameEmail,
        "password": "secret8909"
      };

      request(app).post('/customers/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(401)
        .then(res => {
          expect(res.body).to.have.property('error');
          expect(res.body.error.status).to.eq(401);
          expect(res.body.error.code).to.eq('USR_01');

          done();
        }, done);
    });

  });

});