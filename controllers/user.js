let User = require('../repositories/user');
module.exports = {
  getAll: (req, res, next) => {
    User.findAll(null, (err, users) => {
      if (err) {
        return next(err);
      }
      res.json(users);
    });
  },
  getOne: (req, res, next) => {
    User.find(req.params.id, (err, user) => {
      if (err) {
        return next(err);
      }
      res.json(user);
    });
  },
  getOneBy: (req, res, next) => {
    User.findOneBy(req.params, (err, user) => {
      if (err) {
        return next(err);
      }
      res.json(user);
    });
  }
};