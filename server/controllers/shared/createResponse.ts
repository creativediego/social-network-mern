import HttpResponse from './HttpResponse';
import { StatusCode } from './HttpStatusCode';

export const okResponse = <T>(data: T): HttpResponse => ({
  code: StatusCode.ok,
  body: data,
});

export const notFound = <T>(data?: T): HttpResponse => ({
  code: StatusCode.notFound,
  body: data,
});

export const unauthorizedResponse = (message: string): HttpResponse => ({
  code: StatusCode.unauthorized,
  error: message,
});

export const forbiddenResponse = (message: string): HttpResponse => ({
  code: StatusCode.forbidden,
  error: message,
});
