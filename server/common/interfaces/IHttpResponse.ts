import { Code } from '../enums/StatusCode';
import BaseError from '../errors/BaseError';

/**
 * Interface for HTTP response. Used to define the response object. Used in conjunction with the `adaptRoute` middleware function for handling HTTP responses.
 */
export interface IHttpResponse<T> {
  status: string;
  code: Code;
  body?: T;
  error?: {
    message: string;
  };
  path?: string;
  timestamp?: number;
}
