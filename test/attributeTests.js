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

describe(`Test /attributes routes:`, function() {

  this.timeout('60s');

  // setup
  before(function(done) {
    done();
  });

  // teardown
  after(function(done) {
    done();
  });

  describe('1. Fetch all records', function(done) {

    it('returns 200 "OK" and multiple records', function(done) {
      request(app).get('/attributes')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          err ? done(err) : done();
        }, done);
    });

    it('should return attributes used in product (id:45)', function(done) {
      request(app).get('/attributes/inProduct/45')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.at.least(1);
          
          done();
        }, done);
    });

    it('should return attribute values for attribute (id:2)', function(done) {
      request(app).get('/attributes/values/2')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.at.least(1);
          
          done();
        }, done);
    });

  });

  describe('2. Fetch single record by :id', function(done) {

    it('returns 200 "OK" with single record', function(done) {
      request(app).get('/attributes/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.attribute_id).to.be.equal(1);

          done();
        }, done);
    });

    it('returns 404 "Not Found" when attribute is not found by :id', function(done) {
      request(app).get('/attributes/980')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .then(res => {
          expect(res.body).to.have.property('error');
          expect(res.body.error.status).to.eq(404);
          expect(res.body.error.code).to.eq('ATR_01');

          done();
        }, done);
    });

    it('returns 400 "Bad Request" when :id is not an integer', function(done) {
      request(app).get('/attributes/yolo')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then(res => {
          expect(res.body).to.have.property('error');
          expect(res.body.error.status).to.eq(400);
          expect(res.body.error.code).to.eq('ATR_01');

          done();
        }, done);
    });

  });

});