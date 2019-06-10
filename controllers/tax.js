let Tax = require('../repositories/tax');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');

// import Error classes
let RecordNotFoundError = require('../errors/record-not-found-error');
let ValidationError = require('../errors/validation-error');

module.exports = {
  index: (req, res, next) => {
    Tax.findAll()
    .then(rows => res.json(rows))
    .catch(next);
  },
  
  get: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      Tax.find(req.params.tax_id)
      .then(row => row
        ? res.json(row) 
        : next(new RecordNotFoundError('A department with this ID does not exist.', { code: 'USR_02', param: ':tax_id' }))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  }

};

