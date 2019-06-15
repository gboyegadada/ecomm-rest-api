let Product = require('../repositories/product');
let filter = require('express-validator/filter');
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
          order_by: 'order_by' in req.query ? req.query.order_by : 'product_id', 
          order: 'order' in req.query ? req.query.order : 'asc',
          description_length:  'description_length' in req.query ? req.query.description_length : 200
        };

        Product.findAll({}, sort)
        .then(rows => res.json({ "count": rows.length, "rows": rows }))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },

  search: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        const { query_string, all_words='on', page=1, limit=20, description_length=200} = filter.matchedData(req, {locations: ['query']});
        let sort = { 
          page, 
          limit, 
          all_words, 
          description_length
        };

        Product.search(query_string, sort)
        .then(rows => res.json({ "count": rows.length, "rows": rows }))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },

  getByDepartment: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        Product.findByDepartment(req.params.id)
        .then(rows => res.json(rows))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },

  getByCategory: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        Product.findByCategory(req.params.id)
        .then(rows => res.json(rows))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },

  getLocations: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        Product.getProductLocations(req.params.id)
        .then(rows => res.json(rows))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },

  getReviews: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        Product.getProductReviews(req.params.id)
        .then(rows => res.json(rows))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },

  newReview: (req, res, next) => {
    let result = validatorErrorFormatter(req);
      if (result.isEmpty()) { 
        Product.createProductReview({
          customer_id: req.user.id,
          product_id: req.params.id, 
          review: req.body.review,
          rating: req.body.rating 
        })
        .then(rows => res.json(rows))
        .catch(next);
      } else {
        next(new ValidationError('Validation failed!', result));
      }
  },
  
  get: (req, res, next) => {
    let result = validatorErrorFormatter(req);
    if (result.isEmpty()) { 
      Product.find(req.params.id)
      .then(row => row
        ? res.json(row) 
        : next(new RecordNotFoundError('A product with this ID does not exist.', { code: 'PRD_01', param: ':id' }))
      )
      .catch(next);
    } else {
      next(new ValidationError('Validation failed!', result));
    }
  }

};

