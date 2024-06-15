import { NextFunction, Request, Response } from 'express';
import { ControllerError } from '../errors/ControllerError';
import { ILogger } from '../logger/ILogger';
import { IHttpResponse } from '../interfaces/IHttpResponse';
import { ServiceError } from '../errors/ServiceError';
import { DatabaseError } from '../errors/DatabaseError';
import { AuthError } from '../errors/AuthError';

/**
 * Middleware that handles errors thrown by the application. It logs the error and sends a user-friendly error message to the client. Meant to be used as the last error handling middleware in the Express middleware chain.
 */
export const handleCentralError =
  (logger: ILogger) =>
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    let message = 'An unexpected error occurred.';
    let code = 500;
    // Log the detailed error message for debugging purposes
    // Send a user-friendly error message to the client
    if (err instanceof ControllerError) {
      logger.error(`\n[Controller Error]: ${err.message}`, err);
      message = 'Invalid input. Please check your data and try again.';
      code = err.code;
    } else if (err instanceof ServiceError) {
      logger.error(`\n[Service Error]: ${err.message}`, err);
      message = 'An error occurred while processing your request.';
      code = err.code;
    } else if (err instanceof DatabaseError) {
      logger.error(`\n[Database Error]: ${err.message}`, err);
      message = 'An error occurred while processing your request.';
      code = err.code;
    } else if (err instanceof AuthError) {
      logger.error(`\n[Auth Error]: ${err.message}`, err);
      message = err.message;
      code = err.code;
    } else {
      // Handle other unexpected errors
      // Log the detailed error message for debugging purposes
      logger.error(`Unexpected Error: ${err.message}`, err);
    }
    const clientResponse: IHttpResponse<void> = {
      status: 'error',
      timestamp: Date.now(),
      code,
      error: {
        message,
      },
      path: req.path,
    };
    // Send a user-friendly error message to the client
    res.status(clientResponse.code).json(clientResponse);
  };
