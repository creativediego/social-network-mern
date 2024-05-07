import express, { Express } from 'express';
import { Server, createServer } from 'http';
import { configCors } from './configCors';
import { handleCentralError } from '../common/middleware/handleCentralError';
import { registerDAOs } from './registerDAOs';
import { registerServices } from './registerServices';
import { registerControllers } from './registerControllers';
import { ILogger } from '../common/logger/ILogger';
import { Dep } from './Dependencies';
import { handleUncaughtException } from '../common/middleware/handleUncaughtException';
import { dependencyContainer } from './DependencyContainer';
import { CustomLogger } from '../common/logger/CustomLogger';
import { winstonLogger } from './configWinstonLogger';
import { configUserRoutes } from '../features/user/routes/userRoutes';
import { configPostRoutes } from '../features/post/routes/postRoutes';
import { configAuthRoutes } from '../common/auth/routes/authRoutes';
import { configChatRoutes } from '../features/chat/routes/chatRoutes';
import { configLikeRoutes } from '../features/like/routes/likeRoutes';
import { configSearchRoutes } from '../features/search/routes/searchRoutes';
import { configFollowRoutes } from '../features/follow/routes/followRoutes';
import { configNotificationsRoutes as configNotificationRoutes } from '../features/notification/routes/notificationRoutes';

/**
 * Configures and initializes an Express application and an HTTP server.
 *
 * @returns {Object} An object containing the Express application and HTTP server.
 * @property {Express} app - The configured Express application.
 * @property {Server} httpServer - The initialized HTTP server.
 */
export const configExpressApp = (
  apiPath: string
): { app: Express; httpServer: Server; logger: ILogger } => {
  // Register the Express app, HTTP server, and logger in the dependency container.
  dependencyContainer.register(Dep.App, [], () => express());
  dependencyContainer.register(Dep.HttpServer, [Dep.App], (app: Express) =>
    createServer(app)
  );
  dependencyContainer.register(
    Dep.Logger,
    [],
    () => new CustomLogger(winstonLogger)
  );

  // Resolve the app, server, and logger dependencies.
  const app = dependencyContainer.resolve<Express>(Dep.App);
  const httpServer = dependencyContainer.resolve<Server>(Dep.HttpServer);
  const logger = dependencyContainer.resolve<ILogger>(Dep.Logger);

  // Configure middleware
  configCors(app); // Configure Cross-Origin Resource Sharing (CORS) middleware.
  handleUncaughtException(logger); // Handle uncaught exceptions with the provided logger.

  // Register DAO and Service dependencies
  registerDAOs(dependencyContainer); // Register Data Access Objects (DAOs).
  registerServices(dependencyContainer); // Register services.
  registerControllers(dependencyContainer); // Register controllers.

  // Register middleware
  app.use(express.json()); // Parse JSON request bodies.
  app.use(express.urlencoded({ extended: true }));

  // Config and register routes
  const authRouter = configAuthRoutes(dependencyContainer);
  const userRouter = configUserRoutes(dependencyContainer);
  const postRouter = configPostRoutes(dependencyContainer);
  const chatRouter = configChatRoutes(dependencyContainer);
  const likeRouter = configLikeRoutes(dependencyContainer);
  const followRouter = configFollowRoutes(dependencyContainer);
  const searchRouter = configSearchRoutes(dependencyContainer);
  const notificationRouter = configNotificationRoutes(dependencyContainer);
  app.use(apiPath + '/auth', authRouter);
  app.use(apiPath + '/users', userRouter);
  app.use(apiPath + '/users', followRouter);
  app.use(apiPath + '/posts', postRouter);
  app.use(apiPath + '/posts/likes', likeRouter);
  app.use(apiPath + '/chats', chatRouter);
  app.use(apiPath + '/search', searchRouter);
  app.use(apiPath + '/notifications', notificationRouter);

  // Use the handleCentralError middleware to handle central errors in the application.
  app.use(handleCentralError(logger));

  // Return the configured Express application and HTTP server.
  return { app, httpServer, logger };
};
