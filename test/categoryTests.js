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

describe(`Test /categories routes:`, function() {

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
      request(app).get('/categories')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          err ? done(err) : done();
        }, done);
    });

    it('should return only 5 records when `?limit=5`', function(done) {
      request(app).get('/categories?limit=5')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.count).to.be.eq(5);
          expect(res.body.rows.length).to.be.eq(5);
          
          done();
        }, done);
    });

    it('should return records begining from id:5 when `?page=2`', function(done) {
      request(app).get('/categories?limit=5&page=2')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.count).to.be.at.least(1);
          expect(res.body.rows[0].category_id).to.be.eq(6);
          
          done();
        }, done);
    });

    it('should return records in ASCENDING order when `?order=asc`', function(done) {
      request(app).get('/categories?limit=5&order=asc')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.count).to.be.eq(5);
          expect(res.body.rows[0].category_id).to.be.eq(1);
          
          done();
        }, done);
    });

    it('should return records in DESCENDING order when `?order=desc`', function(done) {
      request(app).get('/categories?limit=5&order=desc')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.count).to.be.eq(5);
          expect(res.body.rows[0].category_id).to.be.eq(7);
          
          done();
        }, done);
    });

    it('should return categories in NATURE department (id:2) ', function(done) {
      request(app).get('/categories/inDepartment/2')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.at.least(1);
          
          done();
        }, done);
    });

    it('should return categories that the product (id:45) is in', function(done) {
      request(app).get('/categories/inProduct/45')
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
      request(app).get('/categories/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.category_id).to.be.equal(1);

          done();
        }, done);
    });

    it('returns 404 "Not Found" when category is not found by :id', function(done) {
      request(app).get('/categories/980')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .then(res => {
          expect(res.body).to.have.property('error');
          expect(res.body.error.status).to.eq(404);
          expect(res.body.error.code).to.eq('CAT_01');

          done();
        }, done);
    });

    it('returns 400 "Bad Request" when :id is not an integer', function(done) {
      request(app).get('/categories/yolo')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then(res => {
          expect(res.body).to.have.property('error');
          expect(res.body.error.status).to.eq(400);
          expect(res.body.error.code).to.eq('CAT_01');

          done();
        }, done);
    });

  });

});