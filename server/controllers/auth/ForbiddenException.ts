import BaseError from '../../errors/BaseError';
import { StatusCode } from '../shared/HttpStatusCode';

export class ForbiddenException extends BaseError {
  public code = StatusCode.forbidden;
  constructor(message: string) {
    super(message);
    Object.freeze(this);
  }
}
