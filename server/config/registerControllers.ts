import { LikeController } from '../features/like/controllers/LikeController';
import { PostController } from '../features/post/controllers/PostController';
import { UserController } from '../features/user/controllers/UserController';
import { IDependencyContainer } from '../common/interfaces/IDependencyContainer';
import { Dep } from './Dependencies';
import { AuthController } from '../common/auth/controllers/AuthController';
import { ILogger } from '../common/logger/ILogger';
import { IUserDao } from '../features/user/daos/IUserDao';
import { IPostService } from '../features/post/services/IPostService';
import { ILikeService } from '../features/like/services/LikeService';
import { IChatService } from '../features/chat/services/IChatService';
import ChatController from '../features/chat/controllers/ChatController';
import SearchController from '../features/search/controllers/SearchController';
import { IPostDao } from '../features/post/daos/IPostDao';
import { IFollowService } from '../features/follow/services/IFollowService';
import FollowController from '../features/follow/controllers/FollowController';
import NotificationController from '../features/notification/controllers/NotificationController';

/**
 * registerControllers function.
 *
 * This function registers all controllers in the dependency container.
 * Each controller is registered with its name, a list of its dependencies, and a factory function that creates an instance of the controller.
 *
 * The factory function takes the dependencies of the controller as parameters and returns a new instance of the controller.
 *
 * @param {IDependencyContainer} container - The dependency container.
 */
export const registerControllers = (container: IDependencyContainer): void => {
  // Auth Controller
  container.register(
    Dep.AuthController,
    [Dep.UserDao, Dep.Logger],
    (userDao: IUserDao, logger: ILogger) => new AuthController(userDao, logger)
  );

  // User Controller
  container.register(
    Dep.UserController,
    [Dep.UserDao, Dep.Logger],
    (userDao: IUserDao, logger: ILogger) => new UserController(userDao, logger)
  );

  container.register(
    Dep.PostController,
    [Dep.PostService, Dep.Logger],
    (postService: IPostService, logger: ILogger) =>
      new PostController(postService, logger)
  );

  container.register(
    Dep.ChatController,
    [Dep.ChatService, Dep.Logger],
    (chatService: IChatService, logger: ILogger) =>
      new ChatController(chatService, logger)
  );

  container.register(
    Dep.LikeController,
    [Dep.LikeService, Dep.Logger],
    (likeService: ILikeService, logger: ILogger) =>
      new LikeController(likeService, logger)
  );

  container.register(
    Dep.FollowController,
    [Dep.FollowService, Dep.Logger],
    (followService: IFollowService, logger: ILogger) =>
      new FollowController(followService, logger)
  );

  container.register(
    Dep.SearchController,
    [Dep.UserDao, Dep.PostDao, Dep.Logger],
    (userDao: IUserDao, postDao: IPostDao) =>
      new SearchController(userDao, postDao)
  );

  container.register(
    Dep.NotificationController,
    [Dep.NotificationDao, Dep.Logger],
    (notificationDao, logger) =>
      new NotificationController(notificationDao, logger)
  );
};
