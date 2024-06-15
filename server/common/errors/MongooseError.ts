import BaseError from './BaseError';

/**
 * Mongoose Schema hook error to be thrown during Mongoose schema hooks.
 */
export class MongooseError extends BaseError {
  constructor(message: string, error?: unknown) {
    message = 'Mongoose Schema hook error: ' + message;
    super(message, error);
    Object.freeze(this);
    this.name = 'MongooseError';
  }
}
