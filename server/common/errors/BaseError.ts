import { Code } from '../enums/StatusCode';

/**
 * Base class for all custom errors. Used to define the error object. Extends the built-in `Error` class and also restores the prototype chain.
 * Defines a `isOperational` property that is set to true by default. This property helps to distinguish operational errors from programmer errors. Used in conjunction with the `errorHandler` middleware function for handling errors.
 */
export default abstract class BaseError extends Error {
  public readonly isOperational: boolean = true;
  public readonly code: Code;
  constructor(message: string, err?: unknown, code?: Code) {
    super(message);
    this.code = code || Code.internalError;
    // Manually set the prototype of CustomError to the prototype of the original error
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
    if (err && err instanceof Error) {
      this.message = this.message + '\nOriginal Error Message:\n' + err.message;
    }
  }
}
