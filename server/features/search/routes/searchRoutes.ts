import { Router } from 'express';
import { IDependencyContainer } from '../../../common/interfaces/IDependencyContainer';
import { Dep } from '../../../config/Dependencies';
import { adaptRequest } from '../../../common/middleware/adaptRequest';
import { isAuthenticated } from '../../../common/auth/util/isAuthenticated';
import ISearchController from '../controllers/ISearchController';

export function configSearchRoutes(
  dependencyContainer: IDependencyContainer
): Router {
  const searchController = dependencyContainer.resolve<ISearchController>(
    Dep.SearchController
  );
  const router: Router = Router();
  router.get(
    '/:keyword',
    isAuthenticated,
    adaptRequest(searchController.findAll)
  );
  router.get(
    '/posts/:keyword',
    isAuthenticated,
    adaptRequest(searchController.findAllPosts)
  );
  router.get(
    '/users/:keyword',
    isAuthenticated,
    adaptRequest(searchController.findAllUsers)
  );

  return router;
}
