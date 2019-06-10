let Order = require('../repositories/order');
let Cart = require('../repositories/cart');
let filter = require('express-validator/filter');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');

// import Error classes
let RecordNotFoundError = require('../errors/record-not-found-error');
let ValidationError = require('../errors/validation-error');

/**
 * Helper fn to convert cart items to order details.
 * 
 * @param {object} order 
 * @param {string} cart_id 
 */
let addLineItems = (order, cart_id) => {
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

module.exports = {
  index: (req, res, next) => {
      Order.findAll({ customer_id: req.user.id})
      .then(rows => res.json(rows))
      .catch(next);
  },
  
  create: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      const { cart_id, shipping_id, tax_id } = filter.matchedData(req, {locations: ['body']});

      Order.create({
        customer_id: req.user.id,
        shipping_id, 
        tax_id,
        created_on: new Date()
      })
      .then(order => addLineItems(order, cart_id))
      .then(order => order
        ? res.json({ order_id: order.order_id }) 
        : next(new RecordNotFoundError('An order with this ID does not exist.', { code: 'USR_02', param: 'order_id' }))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },
  
  get: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      Order.getOrderDetails(req.params.id)
      .then(rows => rows
        ? res.json(rows) 
        : next(new RecordNotFoundError('A order with this ID does not exist.', { code: 'USR_02', param: ':id' }))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },
  
  getShortDetail: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      Order.find(req.params.id)
      .then(row => {
        if (!row) {
          return next(new RecordNotFoundError('A order with this ID does not exist.', { code: 'USR_02', param: ':id' }))
        }

        res.json({  
          "order_id": row.order_id,
          "total_amount": row.total_amount,
          "created_on": row.created_on,
          "shipped_on": row.shipped_on,
          "status": row.status,
          "name": row.name
        })  
      })
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  }

};

