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

// load /cart repository
let Cart = require('../repositories/cart');


describe(`Test /orders routes:`, function() {

  this.timeout('60s');
  
  // create a JWT
  const EMAIL = 'boyega@gmail.com';
  const TOKEN = jwt.sign({ id: 1, email: EMAIL }, process.env.AUTH0_SECRET, {
    expiresIn: '10s',
    audience: process.env.AUTH0_ID
  });

  // setup
  before(function(done) {
    done();
  });

  // teardown
  after(function(done) {
    done();
  });

  describe('1. Add new items to cart and create new order', function(done) {
    let CART_ID = "o-jih78gghjka";

    it('Creates order', function(done) {

      // Add stuff to cart in the db
      Cart
      .addItem({
        cart_id: CART_ID,
        product_id: 5,
        attributes: 'RED'
      })

      // Then test order creation endpoint
      .then(items => {
        request(app).post('/orders')
        .set('Accept', 'application/json')
        .set('USER-KEY', `Bearer ${TOKEN}`)
        .set('Content-Type', 'application/json')
        .send({
          cart_id: CART_ID,
          shipping_id: 2,
          tax_id: 1,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.property('order_id');
          
          done();
        }, done);
      }).catch(err => done(err));
    });

    it('Gets order details', function(done) {
        request(app).get('/orders/1')
        .set('Accept', 'application/json')
        .set('USER-KEY', `Bearer ${TOKEN}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.at.least(1);
          expect(res.body[0]).to.have.property('order_id');
          expect(res.body[0]).to.have.property('product_id');
          
          done();
        }, done);
    });

    it('Gets short order details', function(done) {
        request(app).get('/orders/shortDetail/1')
        .set('Accept', 'application/json')
        .set('USER-KEY', `Bearer ${TOKEN}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.property('order_id');
          expect(res.body).to.have.property('total_amount');
          expect(res.body.total_amount).to.be.greaterThan(0);
          
          done();
        }, done);
    });

    it('Lists orders by customer', function(done) {
        request(app).get('/orders/inCustomer')
        .set('Accept', 'application/json')
        .set('USER-KEY', `Bearer ${TOKEN}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.at.least(1);
          expect(res.body[0]).to.have.property('order_id');
          
          done();
        }, done);
    });


  });


});