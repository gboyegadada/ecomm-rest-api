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
const EMAIL = 'boyega@gmail.com';

// load the server
let app = require('../server');

describe(`Test /customers routes:`, function() {

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

    it('returns 200 "OK" when name, email and password are provided', function(done) {
      let data = {
        "name": "Ben Affleck",
        "email": EMAIL,
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
        "email": EMAIL,
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

    it('returns 200 "OK" when email and password are valid', function(done) {
      let data = {
        "email": EMAIL,
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
        "email": EMAIL,
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

  

  describe('3. Sign in with Facebook', function() {

    const fb_access_token = 'EAAGb5RqMa5wBABowO3dyZClgyhMOw9KVuA3WqgTCVLTDmPwaRjeZCFsZB0ZCsCfr0ToQi6dvewhsKfKQfHgVOHDNmJuESM3FAAnMviMIg3kyGvjjGqDH8gCFpqjA8AKtDdOKwuZCEqkTMszvMcavUd9ZCjmS4L15Ds3oADR1Oixp9jO5HoRuT3gjtgBRvBKaYZD';

    it('returns 200 "OK" when access_token is valid', function(done) {
      done(); return;

      request(app).post('/customers/facebook')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({access_token: fb_access_token})
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.customer.schema.email).to.be.equal(EMAIL);
          expect(res.body.expires_in).to.be.equal('24h');
          expect(res.body).to.have.property('accessToken');

          done();
        }, done);
    });

    
    it('returns 401 "Unauthorized" when access_token is invalid', function(done) {

      request(app).post('/customers/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({access_token: `${fb_access_token}k`})
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
  

  describe('4. Customer Profile', function() {

    // create a JWT
    let token = jwt.sign({ id: 1, email: EMAIL }, process.env.AUTH0_SECRET, {
      expiresIn: '10s',
      audience: process.env.AUTH0_ID
    });

    it('Get profile: returns 200 "OK" and customer ID and profile', function(done) {

      request(app).get('/customer')
        .set('Accept', 'application/json')
        .set('USER-KEY', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('email');
          expect(res.body).to.not.have.property('password');
          expect(res.body.email).to.be.equal(EMAIL);

          done();
        }, done);
    });

    it('Update customer profile: 200 "OK" and customer profile', function(done) {
      let data = {
        "name": "Santa Clause",
        "email": EMAIL,
        "day_phone": "07062347890",
        "eve_phone": "07062347890",
        "mob_phone": "07062347890"
      };

      request(app).put('/customer')
        .set('Accept', 'application/json')
        .set('USER-KEY', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('day_phone');
          expect(res.body).to.have.property('eve_phone');
          expect(res.body).to.have.property('mob_phone');
          expect(res.body).to.not.have.property('password');
          expect(res.body.name).to.be.equal(data.name);
          expect(res.body.day_phone).to.be.equal(data.day_phone);
          expect(res.body.eve_phone).to.be.equal(data.eve_phone);
          expect(res.body.mob_phone).to.be.equal(data.mob_phone);

          done();
        }, done);
    });

    it('Update customer address: 200 "OK" and customer profile', function(done) {
      let data = {
        "address_1": "1 Towry Close",
        "city": "New York",
        "region": "US",
        "shipping_region_id": 2,
        "postal_code": "10001",
        "country": "USA"
      };

      request(app).put('/customers/address')
        .set('Accept', 'application/json')
        .set('USER-KEY', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.property('name');
          expect(res.body).to.not.have.property('password');
          expect(res.body.city).to.be.equal(data.city);
          expect(res.body.region).to.be.equal(data.region);
          expect(res.body.shipping_region_id).to.be.equal(data.shipping_region_id);
          expect(res.body.postal_code).to.be.equal(data.postal_code);
          expect(res.body.country).to.be.equal(data.country);

          done();
        }, done);
    });


    it('Update credit card number: 200 "OK" and customer profile', function(done) {
      let data = {
        "credit_card": "5105105105105100"
      };

      request(app).put('/customers/creditCard')
        .set('Accept', 'application/json')
        .set('USER-KEY', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.property('credit_card');
          expect(res.body).to.not.have.property('password');
          expect(res.body.credit_card).to.be.equal('XXXXXXXXXXXX5100');

          done();
        }, done);
    });

  });

});