import { Server } from 'http';
import FirebaseJWTService from '../services/FirebaseJWTService';
import { IJWTService } from '../services/IJWTService';
import JWTService from '../services/JWTService';
import SocketService from '../services/SocketService';
import { IDependencyContainer } from './IDependencyContainer';
import IBaseDao from '../daos/shared/IDao';
import IUser from '../models/users/IUser';
import BcryptHasher from '../controllers/auth/BcryptHasher';
import { Dep } from './Dependencies';

/**
 * registerServices function.
 *
 * This function registers all services and their dependencies in the dependency container.
 * Each service is registered with its name, a list of its dependencies, and a factory function that creates an instance of the service.
 *
 * The factory function takes the dependencies of the service as parameters and returns a new instance of the service.
 *
 * @param {IDependencyContainer} container - The dependency container.
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
      userDao: IBaseDao<IUser>
    ) => new SocketService(firebaseJWTService, httpServer, userDao)
  );
  container.register(Dep.HashService, [], () => new BcryptHasher(10));
};
