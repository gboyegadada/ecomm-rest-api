let Cart = require('../repositories/cart');
let filter = require('express-validator/filter');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');

// import Error classes
let RecordNotFoundError = require('../errors/record-not-found-error');
let ValidationError = require('../errors/validation-error');

module.exports = {

  getItems: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
      Cart.getItems(req.params.cart_id)
      .then(rows => (rows.length > 0 && null === rows[0].item_id) ? res.json([]) : res.json(rows))
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },

  add: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      const { cart_id, product_id, attributes } = filter.matchedData(req, {locations: ['body']});

      Cart.addItem({
        cart_id,
        product_id, 
        attributes,
        quantity: 1
      })
      .then(rows => res.json(rows))
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },

  update: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      const { quantity } = filter.matchedData(req, {locations: ['body']});

      Cart.updateItem(req.params.item_id, { quantity })
      .then(item => res.json(item))
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  }

};

