'use strict';
class AuthenticationError extends Error {
  constructor(message, extra) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'AuthenticationError';

    this.extra = extra;
    this.message = this.extra.msg || message || 'One or more required parameters are missing from your request.';
  }
}
module.exports = AuthenticationError;