import { Router } from 'express';
import { IDependencyContainer } from '../../../common/interfaces/IDependencyContainer';
import { Dep } from '../../../config/Dependencies';
import { adaptRequest } from '../../../common/middleware/adaptRequest';
import { isAuthenticated } from '../../../common/auth/util/isAuthenticated';
import { INotificationController } from '../controllers/INotificationController';

/**
 * Configures the Express notification routes for the application.
 * @param dependencyContainer the top level dependency container of the application for resolving dependencies
 * @returns the configured Express router for the notification feature
 */
export function configNotificationsRoutes(
  dependencyContainer: IDependencyContainer
): Router {
  const notificationController =
    dependencyContainer.resolve<INotificationController>(
      Dep.NotificationController
    );
  const router: Router = Router();

  router.get(
    '/',
    isAuthenticated,
    adaptRequest(notificationController.findNotifications)
  );
  router.get(
    '/count',
    isAuthenticated,
    adaptRequest(notificationController.getNotificationCount)
  );
  router.put(
    '/:nid',
    isAuthenticated,
    adaptRequest(notificationController.markNotificationRead)
  );

  return router;
}
