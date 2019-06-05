let Category = require('../repositories/category');
let validatorErrorFormatter = require('../handlers/validation-error-formatter');

// import Error classes
let RecordNotFoundError = require('../errors/record-not-found-error');
let ValidationError = require('../errors/validation-error');

module.exports = {
  index: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        let sort = { 
          page: 'page' in req.query ? req.query.page : 1, 
          limit: 'limit' in req.query ? req.query.limit : 20, 
          order_by: 'order_by' in req.query ? req.query.order_by : 'category_id', 
          order: 'order' in req.query ? req.query.order : 'asc' 
        };

        Category.findAll({}, sort)
        .then(rows => res.json({ "count": rows.length, "rows": rows }))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },

  getByDepartment: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        let sort = { 
          page: 1, 
          limit: 100, 
          order_by: 'category_id', 
          order: 'asc' 
        };

        Category.findAll({department_id: req.params.id}, sort)
        .then(rows => res.json(rows))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },

  getByProduct: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        Category.findByProduct(req.params.id)
        .then(rows => res.json(rows))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },
  
  get: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      Category.find(req.params.id)
      .then(row => row
        ? res.json(row) 
        : next(new RecordNotFoundError('A category with this ID does not exist.', { code: 'CAT_01', param: ':id' }))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  }

};

