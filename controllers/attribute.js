let Attribute = require('../repositories/attribute');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');

// import Error classes
let RecordNotFoundError = require('../errors/record-not-found-error');
let ValidationError = require('../errors/validation-error');

module.exports = {
  index: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        Attribute.findAll()
        .then(rows => res.json(rows))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },

  getByProduct: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        Attribute.findByProduct(req.params.id)
        .then(rows => res.json(rows))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },
  
  get: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      Attribute.find(req.params.id)
      .then(row => row
        ? res.json(row) 
        : next(new RecordNotFoundError('A attribute with this ID does not exist.', { code: 'ATR_01', param: ':id' }))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  },

  getValues: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        Attribute.getValues(req.params.id)
        .then(rows => res.json(rows))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  }

};

