/**
 * This module contains utility functions for creating HTTP responses. They are used in the controllers to send responses to the client.
 */
import { IHttpResponse } from '../interfaces/IHttpResponse';
import { Code } from '../enums/StatusCode';
import { ControllerError } from '../errors/ControllerError';

export const okResponse = <T>(data: T): IHttpResponse<T> => ({
  status: 'success',
  code: Code.ok,
  body: data,
});

export const noContentResponse = <T>(): IHttpResponse<T> => ({
  status: 'success',
  code: Code.noContent,
});

export const badRequestResponse = <T>(
  error: ControllerError
): IHttpResponse<T> => ({
  status: 'error',
  code: Code.badRequest,
  error,
});

export const notFoundResponse = <T>(
  error: ControllerError
): IHttpResponse<T> => ({
  status: 'error',
  code: Code.notFound,
  error,
});

export const unauthorizedResponse = <T>(
  error: ControllerError
): IHttpResponse<T> => ({
  status: 'error',
  code: Code.unauthorized,
  error,
});

export const forbiddenResponse = <T>(
  error: ControllerError
): IHttpResponse<T> => ({
  status: 'error',
  code: Code.forbidden,
  error,
});

export const internalErrorResponse = <T>(
  error: ControllerError
): IHttpResponse<T> => ({
  status: 'error',
  code: Code.internalError,
  error,
});
