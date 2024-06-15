import { Request, Response, NextFunction } from 'express';
import { IHttpRequest } from '../interfaces/IHttpRequest';
import { IHttpResponse } from '../interfaces/IHttpResponse';

/**
 * Adapts an Express controller method to accept a standardized HTTP request object
 * and return a standardized HTTP response object.
 * Helps to decouple the Express controller from the HTTP request/response objects. Also helps to standardize the HTTP request/response objects.
 * Handles any errors thrown by the controller method and passes them to the Express error handling middleware.
 * @param controllerCall - The controller method to be decoupled.
 * @returns An Express middleware function that adapts the controller method.
 */
const adaptRequest =
  <T>(controllerCall: (request: IHttpRequest) => Promise<IHttpResponse<T>>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Create a HTTP request object decoupled from Express.
    const request: IHttpRequest = {
      params: req.params,
      body: req.body,
      user: req.user,
      method: req.method,
      url: req.url,
      path: req.path,
      headers: req.headers as Record<string, string>, // Ensure headers are of the correct type
      query: req.query, // Ensure query is of the correct type
      responseType: req.headers['content-type'] as
        | 'json'
        | 'text'
        | 'blob'
        | 'arraybuffer',
    };

    try {
      // Call the adapted controller method with the standardized request object.
      const response: IHttpResponse<T> = await controllerCall(request);
      // Set the HTTP status and send the response body as JSON.
      res.status(response.code).json(response.body);
    } catch (err) {
      // Pass any errors to the Express error handling middleware.
      next(err);
    }
  };

export { adaptRequest };
