import { Router } from 'express';
import { IDependencyContainer } from '../../../common/interfaces/IDependencyContainer';
import { Dep } from '../../../config/Dependencies';
import { adaptRequest } from '../../../common/middleware/adaptRequest';
import { isAuthenticated } from '../../../common/auth/util/isAuthenticated';
import { IUserController } from '../controllers/IUserController';

/**
 * Configures the user routes. It uses the user controller to handle the HTTP requests. It also uses the adaptRequest middleware to adapt the Express request and response objects to standardized objects. It also uses the isAuthenticated middleware to check if the user is authenticated before allowing access to certain routes. Dependency injection is used to resolve the user controller.
 */
export function configUserRoutes(
  dependencyContainer: IDependencyContainer
): Router {
  const userController = dependencyContainer.resolve<IUserController>(
    Dep.UserController
  );
  const router: Router = Router();

  router.get('/', adaptRequest(userController.findAll));
  router.get(
    '/:username',
    isAuthenticated,
    adaptRequest(userController.findOne)
  );
  router.post('/', adaptRequest(userController.create));
  router.put('/:userId', isAuthenticated, adaptRequest(userController.update));
  router.delete('/:userId', adaptRequest(userController.delete));

  return router;
}
