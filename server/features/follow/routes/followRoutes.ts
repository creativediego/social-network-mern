import { Router } from 'express';
import { IDependencyContainer } from '../../../common/interfaces/IDependencyContainer';
import { Dep } from '../../../config/Dependencies';
import { adaptRequest } from '../../../common/middleware/adaptRequest';
import { isAuthenticated } from '../../../common/auth/util/isAuthenticated';
import IFollowController from '../controllers/IFollowController';

export function configFollowRoutes(
  dependencyContainer: IDependencyContainer
): Router {
  const followController = dependencyContainer.resolve<IFollowController>(
    Dep.FollowController
  );
  const router: Router = Router();

  router.get(
    '/:userId/follow',
    isAuthenticated,
    adaptRequest(followController.findFollow)
  );

  router.post(
    '/:userId/follow',
    isAuthenticated,
    adaptRequest(followController.createFollow)
  );

  router.delete(
    '/:userId/unfollow',
    isAuthenticated,
    adaptRequest(followController.deleteFollow)
  );

  return router;
}
