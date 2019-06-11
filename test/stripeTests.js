// import libraries
let request  = require('supertest');
let expect   = require('chai').expect;
let jwt      = require('jsonwebtoken');
let chalk    = require('chalk');
let random   = require('randomstring');
let _        = require('lodash');

// load the config
require('dotenv').config();

// load repositories
let Cart = require('../repositories/cart');
let Order = require('../repositories/order');

// Load stripe
const stripe = require("stripe")(process.env.STRIPE_KEY);

const DEBUG = false;

// load the server
let app = require('../server');

describe(`Test /stripe routes:`, function() {

  this.timeout('60s');
  
  // create a JWT
  const EMAIL = 'boyega@gmail.com';
  const TOKEN = jwt.sign({ id: 1, email: EMAIL }, process.env.AUTH0_SECRET, {
    expiresIn: '30s',
    audience: process.env.AUTH0_ID
  });
  let ORDER_ID;
  let STRIPE_TOKEN;

  // setup
  before(function(done) {
    let CART_ID = "o-jih78gghjka";  
    
    Promise.all([ 

      // 0: Create cart and order
      Cart
      .addItem({
        cart_id: CART_ID,
        product_id: 5,
        attributes: 'RED'
      })
      .then(items => Order.create({
          customer_id: 1,
          shipping_id: 2, 
          tax_id: 2,
          created_on: new Date()
        })
      )
      .then(order => addLineItems(order, CART_ID)),

      // 1: Get strip token
      stripe.tokens.create({
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2020,
          cvc: '123'
        }
      })
      .then(token => STRIPE_TOKEN = token.id)

    ])
    .then(() => done());
  });

  // teardown
  after(function(done) {
    done();
  });

    
  /**
   * Helper fn to convert cart items to order details.
   * 
   * @param {object} order 
   * @param {string} cart_id 
   */
  let addLineItems = (order, cart_id) => {
    ORDER_ID = order.order_id;

    return Cart.getItems(cart_id)
          .then(cartItems => {
            let total_amount = 0;
            cartItems.forEach(item => {
              let itemPromise = Order.createLineItem({
                order_id: order.order_id,
                product_id: item.product_id,
                attributes: item.attributes,
                product_name: item.name,
                quantity: item.quantity,
                unit_cost: item.price
              });
              
              total_amount += item.subtotal;
            });

            return Order.update(order.order_id, { total_amount })
          });
  }

  describe('1. Do Stripe charge', function(done) {
    it('returns 200 "OK" and stripe response', function(done) {
      let charge = {
        "amount": 999,
        "currency": "usd",
        "description": "Example charge",
        "stripeToken": STRIPE_TOKEN,
        "order_id": ORDER_ID
      };

      request(app).post('/stripe/charge')
        .set('Accept', 'application/json')
        .set('USER-KEY', `Bearer ${TOKEN}`)
        .set('Content-Type', 'application/json')
        .send(charge)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          err ? done(err) : done();
        }, done);
    });

    it('returns 400 "OK" when Order ID does not exist', function(done) {
      let charge = {
        "amount": 999,
        "currency": "usd",
        "description": "Example charge",
        "stripeToken": "tok_1Ek0AP2eZvKYlo2C3Yi7xA4L",
        "order_id": 45
      };

      request(app).post('/stripe/charge')
        .set('Accept', 'application/json')
        .set('USER-KEY', `Bearer ${TOKEN}`)
        .set('Content-Type', 'application/json')
        .send(charge)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          err ? done(err) : done();
        }, done);
    });
    
    it('returns 200 "OK" from /webhooks endpoint', function(done) {
      request(app).post('/stripe/webhooks')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({})
        .expect(200)
        .end((err, res) => {
          err ? done(err) : done();
        }, done);
    });

  });

});