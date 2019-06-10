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

describe(`Test /tax routes:`, function() {

  this.timeout('60s');

  // setup
  before(function(done) {
    done();
  });

  // teardown
  after(function(done) {
    done();
  });

  describe('1. Fetch multiple + paginated records', function(done) {

    it('returns 200 "OK" and multiple records', function(done) {
      request(app).get('/tax')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          err ? done(err) : done();
        }, done);
    });

  });

  describe('2. Fetch single record by :id', function(done) {

    it('returns 200 "OK" with single record', function(done) {
      request(app).get('/tax/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.tax_id).to.be.equal(1);

          done();
        }, done);
    });

    it('returns 404 "Not Found" when tax is not found by :tax_id', function(done) {
      request(app).get('/tax/980')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .then(res => {
          expect(res.body).to.have.property('error');
          expect(res.body.error.status).to.eq(404);
          expect(res.body.error.code).to.eq('USR_02');

          done();
        }, done);
    });

    it('returns 400 "Bad Request" when :tax_id is not an integer', function(done) {
      request(app).get('/tax/yolo')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then(res => {
          expect(res.body).to.have.property('error');
          expect(res.body.error.status).to.eq(400);
          expect(res.body.error.code).to.eq('USR_02');

          done();
        }, done);
    });

  });

});