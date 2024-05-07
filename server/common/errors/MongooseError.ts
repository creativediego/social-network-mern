import BaseError from './BaseError';

export class MongooseError extends BaseError {
  constructor(message: string, error?: unknown) {
    message = 'Mongoose Schema hook error: ' + message;
    super(message, error);
    Object.freeze(this);
    this.name = 'MongooseError';
  }
}
