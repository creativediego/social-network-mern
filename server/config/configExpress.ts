import { Express } from 'express';
import { configCors } from './configCors';
import { handleUncaughtException } from '../errors/handleCentralError';

/**
 * configExpress function.
 *
 * This function instantiates the Express application and configures global middleware.
 * It uses the `express` package to create the application and the `configMiddleWare` function to configure the middleware.
 *
 * @returns {Express} The Express application with the configured middleware.
 */
export const configMiddleWare = (app: Express) => {
  configCors(app);
  handleUncaughtException();
  return app;
};
