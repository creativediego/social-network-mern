import express from 'express';
import { Server, createServer } from 'http';
import configGlobalMiddleware from './configGlobalMiddleware';

/**
 * Instantiates Express app and configures global middleware.
 * @returns Express app
 */
const createApp = () => {
  const app = express();
  configGlobalMiddleware(app);
  return app;
};

export const app = createApp();
export const httpServer: Server = createServer(app); // used for sockets
