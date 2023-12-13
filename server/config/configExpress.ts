import { Express } from 'express';
import { configCors } from './configCors';
import { handleUncaughtException } from '../errors/handleCentralError';

/**
 * Instantiates Express app and configures global middleware.
 * @returns Express app
 */
export const configMiddleWare = (app: Express) => {
  configCors(app);
  handleUncaughtException();
  return app;
};
