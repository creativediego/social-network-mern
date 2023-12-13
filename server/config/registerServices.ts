import { Server } from 'http';
import FirebaseJWTService from '../services/FirebaseJWTService';
import { IJWTService } from '../services/IJWTService';
import JWTService from '../services/JWTService';
import SocketService from '../services/SocketService';
import { IDependencyContainer } from './IDependencyContainer';
import IDao from '../daos/shared/IDao';
import IUser from '../models/users/IUser';
import BcryptHasher from '../controllers/auth/BcryptHasher';
import { Dep } from './Dependencies';
/**
 * @file
 * Registers all services and their dependencies using the parameterized dependency injection container.
 */

export const registerServices = (container: IDependencyContainer): void => {
  container.register(Dep.JWTService, [], () => new JWTService());
  container.register(
    Dep.FirebaseJWTService,
    [],
    () => new FirebaseJWTService()
  );
  container.register(
    Dep.SocketService,
    [Dep.FirebaseJWTService, Dep.HttpServer, Dep.UserDao],
    (
      firebaseJWTService: IJWTService,
      httpServer: Server,
      userDao: IDao<IUser>
    ) => new SocketService(firebaseJWTService, httpServer, userDao)
  );
  container.register(Dep.HashService, [], () => new BcryptHasher(10));
};
