/**
 * Interface for HTTP request. Used to define the request object. Used in conjunction with the `adaptRequest` middleware function for handling HTTP requests.
 */
export interface IHttpRequest {
  method: string; // HTTP method (e.g., GET, POST, PUT, DELETE)
  url: string; // URL for the request
  path: string; // URL path
  headers: Record<string, string>; // HTTP headers
  params: Record<string, string>; // URL parameters
  body: any; // Request body (could be a string, object, etc.)
  query: Record<string, any>; // Query parameters
  timeout?: number; // Request timeout in milliseconds
  user?: any;
  session?: any;
  responseType: 'json' | 'text' | 'blob' | 'arraybuffer';
}
