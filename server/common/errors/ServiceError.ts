import { Code } from '../enums/StatusCode';
import BaseError from './BaseError';

/**
 * Custom error class for service errors. Used at all service layers. Defines a name property to identify the error type. Used in conjunction with the `errorHandler` middleware function for handling errors.
 */
export class ServiceError extends BaseError {
  constructor(message: string, code?: Code, error?: unknown) {
    super(message, error, code);
    this.name = 'ServiceError';
    Object.freeze(this);
  }
}
