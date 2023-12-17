import { StatusCode } from '../controllers/shared/HttpStatusCode';
import BaseError from './BaseError';

/**
 * Error thrown when a null object is found in the database, meaning that the object was not found.
 */
export default class DaoNullException extends BaseError {
  public code = StatusCode.notFound;
  constructor(message: string) {
    super(message);
    Object.freeze(this);
  }
}
