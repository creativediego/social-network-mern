import { Router } from 'express';
import { check } from 'express-validator';
import { IDependencyContainer } from '../../../common/interfaces/IDependencyContainer';
import { Dep } from '../../../config/Dependencies';
import { adaptRequest } from '../../../common/middleware/adaptRequest';
import { isAuthenticated } from '../../../common/auth/util/isAuthenticated';
import { IUserController } from '../controllers/IUserController';
import { validateResults } from '../../../common/middleware/validateResults';

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
