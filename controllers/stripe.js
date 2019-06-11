let stripe = require('stripe')(process.env.STRIPE_KEY);
let filter = require('express-validator/filter');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');

// import Error classes
let RecordNotFoundError = require('../errors/record-not-found-error');
let ValidationError = require('../errors/validation-error');

module.exports = {
  charge: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      const { stripeToken, order_id, description, amount, currency } = filter.matchedData(req, {locations: ['body']});

      stripe.charges.create({
        amount,
        currency,
        description,
        source: stripeToken,
        metadata: {order_id},
      })
      .then(charge => res.json(charge))
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },
  
  webhooks: (req, res, next) => {
    res.json({});
  }

};

