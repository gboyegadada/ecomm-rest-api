const { check } = require('express-validator/check');

module.exports =  {
  signUp: () => {
    return [
      check('name', 'Name doesn\'t exists').isLength({ min: 5 }),
      check('email', 'Invalid email').isEmail(),
      check('password').isLength({ min: 5 })
    ];
  }
};