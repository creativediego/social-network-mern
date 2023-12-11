import express, { Express } from 'express';
import { Server, createServer } from 'http';
import { Server as ioServer } from 'socket.io';
import { configCors } from './configCors';
import { createControllers } from './createControllers';
import {
  handleCentralError,
  handleUncaughtException,
} from '../errors/handleCentralError';
import FirebaseJWTService from '../services/FirebaseJWTService';
import { IJWTService } from '../services/IJWTService';
import { ISocketService } from '../services/ISocketService';
import JWTService from '../services/JWTService';
import SocketService from '../services/SocketService';
import { userDao } from './configDaos';

/**
 * Instantiates Express app and configures global middleware.
 * @returns Express app
 */
const configMiddleWare = (app: Express) => {
  configCors(app);
  handleUncaughtException();
  app.use(handleCentralError);
  return app;
};

export const app = express();
export const httpServer: Server = createServer(app); // used for sockets; init before controllers & services

configMiddleWare(app); // must declare before controllers
createControllers(app);
