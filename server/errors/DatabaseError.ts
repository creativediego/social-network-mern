import { StatusCode } from '../controllers/shared/HttpStatusCode';
import BaseError from './BaseError';

export class DatabaseError extends BaseError {
  constructor(message: string, error?: unknown, code?: StatusCode) {
    super(message, error, code);
    this.name = 'DatabaseError';
    Object.freeze(this);
  }
}
