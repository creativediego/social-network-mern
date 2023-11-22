import express from 'express';
import { Server, createServer } from 'http';
import configGlobalMiddleware from './configGlobalMiddleware';
import createControllers from './createControllers';
import {
  handleCentralError,
  handleUncaughtException,
} from '../errors/handleCentralError';

/**
 * Instantiates Express app and configures global middleware.
 * @returns Express app
 */
const createApp = () => {
  const app = express();
  configGlobalMiddleware(app);
  createControllers(app);
  handleUncaughtException();
  app.use(handleCentralError);
  return app;
};

export const app = createApp();
export const httpServer: Server = createServer(app); // used for sockets
