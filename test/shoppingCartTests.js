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

describe(`Test /shoppingcart routes:`, function() {

  this.timeout('60s');

  // setup
  before(function(done) {
    done();
  });

  // teardown
  after(function(done) {
    done();
  });

  describe('1. Generate cart_id and add new items to cart', function(done) {
    let CART_ID = "jih78gghjka";

    it('Generates cart_id: returns 200 "OK" and new cart_id', function(done) {
      request(app).get('/shoppingcart/generateUniqueId')
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
          expect(res.body).to.have.property('cart_id');
          
          done();
        }, done);
    });

    it('Adds product to cart: returns 200 "OK" and list of cart items', function(done) {
      let data = {
        "cart_id": CART_ID,
        "product_id": 5,
        "attributes": "Red"
      };

      request(app).post('/shoppingcart/add')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.at.least(1);
          
          done();
        }, done);
    });

    it('Adds another product to cart: returns 200 "OK" and list of cart items', function(done) {
      let data = {
        "cart_id": CART_ID,
        "product_id": 45,
        "attributes": "Red"
      };

      request(app).post('/shoppingcart/add')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.at.least(2);
          
          done();
        }, done);
    });

    it('Gets cart content: returns 200 "OK" and list of cart items', function(done) {
      request(app).get(`/shoppingcart/${CART_ID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.at.least(2);
          
          done();
        }, done);
    });

    it('Updates item quantity: returns 200 "OK" and list of cart items', function(done) {
      let data = {
        "quantity": 35
      };

      request(app).put('/shoppingcart/update/1')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.at.least(1);
          expect(res.body[0].quantity).to.be.at.eq(35);
          
          done();
        }, done);
    });

    it('Gets cart TOTAL: returns 200 "OK" and cart amount total', function(done) {
      request(app).get(`/shoppingcart/totalAmount/${CART_ID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.property('total_amount');
          
          done();
        }, done);
    });

  });

  describe('2. Save items for later and move them to your cart', function(done) {
    let CART_ID = "jih78gghjka";

    it('Saves item for later: returns 200 "OK"', function(done) {
      request(app).get('/shoppingcart/saveForLater/2')
        .set('Accept', 'application/json')
        .expect(200)        
        .end((err, res) => err ? done(err) : done(), done);
    });

    it('Gets saved items: returns 200 "OK"', function(done) {
      request(app).get(`/shoppingcart/getSaved/${CART_ID}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.at.eq(1);
          
          done();
        }, done);
    });

    it('Moves item back to cart: returns 200 "OK"', function(done) {
      request(app).get(`/shoppingcart/moveToCart/2`)
        .set('Accept', 'application/json')
        .expect(200)                
        .end((err, res) => err ? done(err) : done(), done);
    });

    it('Removes product from cart: returns 200 "OK"', function(done) {
      request(app).delete(`/shoppingcart/removeProduct/2`)
        .set('Accept', 'application/json')
        .expect(200)        
        .end((err, res) => err ? done(err) : done(), done);
    });

  });

  describe('3. Remove products from your cart', function(done) {
    let CART_ID = "jih78gghjka";

    it('Removes product from cart and returns 200 "OK"', function(done) {
      request(app).delete(`/shoppingcart/removeProduct/2`)
        .set('Accept', 'application/json')
        .expect(200)        
        .end((err, res) => err ? done(err) : done(), done);
    });

    it('Returns 200 "OK" and 1 cart item after remove a product', function(done) {
      request(app).get(`/shoppingcart/${CART_ID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.eq(1);
          
          done();
        }, done);
    });

    it('Empties the cart and returns 200 "OK"', function(done) {
      request(app).delete(`/shoppingcart/${CART_ID}`)
        .set('Accept', 'application/json')
        .expect(200)        
        .end((err, res) => err ? done(err) : done(), done);
    });

    it('Returns 200 "OK" and NO cart item after emptying cart', function(done) {
      request(app).get(`/shoppingcart/${CART_ID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.be.eq(0);
          
          done();
        }, done);
    });

  });
  

});