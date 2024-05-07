/**
 * @readonly
 * @enum {number}
 * Represents the http status codes used by the application to send responses to the client.
 */
export enum Code {
  notFound = 404,
  internalError = 500,
  ok = 200,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  conflict = 409,
  noContent = 204,
}
