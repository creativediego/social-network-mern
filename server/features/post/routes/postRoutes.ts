import { Router } from 'express';
import { IDependencyContainer } from '../../../common/interfaces/IDependencyContainer';
import { Dep } from '../../../config/Dependencies';
import { adaptRequest } from '../../../common/middleware/adaptRequest';
import { isAuthenticated } from '../../../common/auth/util/isAuthenticated';
import { IPostController } from '../controllers/IPostController';

export function configPostRoutes(
  dependencyContainer: IDependencyContainer
): Router {
  const postController = dependencyContainer.resolve<IPostController>(
    Dep.PostController
  );
  const router: Router = Router();

  router.get('/', isAuthenticated, adaptRequest(postController.findAll));
  router.get(
    '/:postId',
    isAuthenticated,
    adaptRequest(postController.findById)
  );
  router.get(
    '/:userId',
    isAuthenticated,
    adaptRequest(postController.findAllPostsByAuthorId)
  );
  router.get(
    '/:keyword',
    isAuthenticated,
    adaptRequest(postController.findAllPostsByKeyword)
  );
  router.post('/', isAuthenticated, adaptRequest(postController.create));
  router.put('/:postId', isAuthenticated, adaptRequest(postController.update));
  router.delete(
    '/:postId',
    isAuthenticated,
    adaptRequest(postController.delete)
  );

  return router;
}
