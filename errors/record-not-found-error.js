'use strict';
class RecordNotFoundError extends Error {
  constructor(message, extra) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'RecordNotFoundError';

    this.extra = extra;
    this.message = this.extra.msg || message || 'Record not found for this ID.';
  }
}
module.exports = RecordNotFoundError;