import { StatusCode } from '../controllers/shared/HttpStatusCode';

export default abstract class BaseError extends Error {
  public readonly isOperational: boolean = true;
  public readonly code: StatusCode;
  constructor(message: string, err?: unknown, code?: StatusCode) {
    super(message);
    this.code = code || StatusCode.internalError;
    // Manually set the prototype of CustomError to the prototype of the original error
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
    if (err instanceof Error) {
      this.message =
        this.message + '\n\nOriginal Error Message:\n' + err.message;
    }
  }
}
