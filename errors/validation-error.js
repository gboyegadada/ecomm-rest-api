'use strict';
class ValidationError extends Error {
  constructor(message, result) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'ValidationError';

    let r = result.array();
    this.extra = r[0];
    this.message = this.extra.msg || message || 'One or more required parameters are missing from your request.';
  }
}
module.exports = ValidationError;