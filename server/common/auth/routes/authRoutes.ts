import { Router } from 'express';
import { IDependencyContainer } from '../../../common/interfaces/IDependencyContainer';
import { Dep } from '../../../config/Dependencies';
import { adaptRequest } from '../../../common/middleware/adaptRequest';
import { isAuthenticated } from '../../../common/auth/util/isAuthenticated';
import IAuthController from '../controllers/IAuthController';

/**
 * Configures the authentication express routes.
 * @param dependencyContainer The top app dependency container that resolves the auth controller.
 */
export function configAuthRoutes(
  dependencyContainer: IDependencyContainer
): Router {
  const authController = dependencyContainer.resolve<IAuthController>(
    Dep.AuthController
  );
  const router: Router = Router();

  router.get('/login', isAuthenticated, adaptRequest(authController.login));
  router.post('/register', adaptRequest(authController.register));

  return router;
}
