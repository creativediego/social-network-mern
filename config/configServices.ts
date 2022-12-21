import FirebaseJWTService from '../services/FirebaseJWTService';
import JWTServiceI from '../services/IJWTService';
import ISocketService from '../services/ISocketService';
import JWTService from '../services/JWTService';
import SocketService from '../services/SocketService';
import { httpServer } from './configExpress';
import { userDao } from './configDaos';
/**
 * @file
 * Container that instantiates all services.
 */
export const jwtService: JWTServiceI = new JWTService();
export const firebaseJWTService: JWTServiceI = new FirebaseJWTService();
export const socketService: ISocketService = new SocketService(
  firebaseJWTService,
  httpServer,
  userDao
);
