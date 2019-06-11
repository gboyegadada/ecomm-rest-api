let ShippingRegion = require('../repositories/shipping-region');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');

// import Error classes
let RecordNotFoundError = require('../errors/record-not-found-error');
let ValidationError = require('../errors/validation-error');

module.exports = {
  index: (req, res, next) => {
    ShippingRegion.findAll()
    .then(rows => res.json(rows))
    .catch(next);
  },
  
  get: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      ShippingRegion.find(req.params.shipping_region_id)
      .then(row => row
        ? res.json(row) 
        : next(new RecordNotFoundError('A shipping region with this ID does not exist.', { code: 'USR_02', param: ':shipping_region_id' }))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  }

};

