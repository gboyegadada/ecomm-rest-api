let Cart = require('../repositories/cart');
let filter = require('express-validator/filter');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');
let uniqid = require('uniqid');

// import Error classes
let RecordNotFoundError = require('../errors/record-not-found-error');
let ValidationError = require('../errors/validation-error');

module.exports = {

  generateUniqueId: (req, res, next) => {
      res.json({ "cart_id": uniqid() });
  },

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

  getSaved: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
      Cart.getItems(req.params.cart_id, false)
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
        attributes
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
      .then(rows => res.json(rows))
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },

  moveToCart: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        Cart.updateItem(req.params.item_id, { buy_now: true })
        .then(() => res.send(''))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },

  saveForLater: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        Cart.updateItem(req.params.item_id, { buy_now: false })
        .then(() => res.send(''))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },

  empty: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
      Cart.emptyCart(req.params.cart_id)
      .then(() => res.json([]))
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },

  removeItem: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
      Cart.removeItem(req.params.item_id)
      .then(() => res.send(''))
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },

  getTotalAmount: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
      Cart.getTotalAmount(req.params.cart_id)
      .then(row => res.send(row[0]))
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  }

};

