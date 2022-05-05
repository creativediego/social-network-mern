import ISocketService from '../services/ISocketService';
import JWTService from '../services/JWTService';
import SocketService from '../services/socketService';
import { httpServer } from './configExpress';
/**
 * @file
 * Container that instantiates all services.
 */
export const jwtService: JWTService = new JWTService();
export const socketService: ISocketService = new SocketService(
  jwtService,
  httpServer
);
