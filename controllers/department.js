let Department = require('../repositories/department');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');

// import Error classes
let RecordNotFoundError = require('../errors/record-not-found-error');
let ValidationError = require('../errors/validation-error');

let formatResponseObject = (department) => {
  return {
    "department": {
      "schema": department
    }
  }
}

module.exports = {
  index: (req, res, next) => {
    Department.findAll()
    .then(rows => res.json(rows.map(formatResponseObject)))
    .catch(next);
  },
  
  get: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      Department.find(req.params.id)
      .then(row => row
        ? res.json(formatResponseObject(row)) 
        : next(new RecordNotFoundError('A department with this ID does not exist.', { code: 'DEP_02', param: ':id' }))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  }

};

