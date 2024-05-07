import { Router } from 'express';
import { IDependencyContainer } from '../../../common/interfaces/IDependencyContainer';
import { Dep } from '../../../config/Dependencies';
import { adaptRequest } from '../../../common/middleware/adaptRequest';
import { isAuthenticated } from '../../../common/auth/util/isAuthenticated';
import { ILikeController } from '../controllers/ILikeController';

export function configLikeRoutes(
  dependencyContainer: IDependencyContainer
): Router {
  const likeController = dependencyContainer.resolve<ILikeController>(
    Dep.LikeController
  );
  const router: Router = Router();

  router.get(
    '/:userId',
    isAuthenticated,
    adaptRequest(likeController.findAllPostsLikedByUser)
  );
  router.post(
    '/:postId',
    isAuthenticated,
    adaptRequest(likeController.userLikesPost)
  );
  router.delete(
    '/:postId',
    isAuthenticated,
    adaptRequest(likeController.userUnlikesPost)
  );

  return router;
}
