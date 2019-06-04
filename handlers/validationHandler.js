// import Error classes
let BadRequestError = require('../errors/bad-request');

let validationHandler = next => result => {  
    if (result.isEmpty()) return
  
    if (!next) {
      throw new BadRequestError(
        result.array().map(i => `'${i.param}' has ${i.msg}`).join(' ')
      )
    } else {
      return next(
        new BadRequestError(
          result.array().map(i => `'${i.param}' has ${i.msg}`).join('')
        )  
      )
    }
  }

  module.exports = validationHandler;