import { Code } from '../enums/StatusCode';
import BaseError from './BaseError';

/**
 * Custom error class for controller errors. Used at all controller layers. Defines a name property to identify the error type. Used in conjunction with the `errorHandler` middleware function for handling errors.
 */
export class ControllerError extends BaseError {
  constructor(message: string, code?: Code, error?: unknown) {
    super(message, error, code);
    this.name = 'ControllerError';
    Object.freeze(this);
  }
}
