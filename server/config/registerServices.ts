import { Server } from 'http';
import { FirebaseJWTService } from '../common/auth/services/FirebaseJWTService';
import { IJWTService } from '../common/auth/services/IJWTService';
import { SocketService } from '../features/socket/services/SocketService';
import { IDependencyContainer } from '../common/interfaces/IDependencyContainer';
import { Dep } from './Dependencies';
import { PostService } from '../features/post/services/PostService';
import { IUserDao } from '../features/user/daos/IUserDao';
import { IPostDao } from '../features/post/daos/IPostDao';
import { IHashtagDao } from '../features/hashtag/daos/IHashTagDao';
import { ILikeDao } from '../features/like/daos/ILikeDao';
import { ISocketService } from '../features/socket/services/ISocketService';
import { LikeService } from '../features/like/services/LikeService';
import { INotificationDao } from '../features/notification/daos/NotificationDao';
import { ILogger } from '../common/logger/ILogger';
import { IChatDao } from '../features/chat/daos/IChatDao';
import { ChatService } from '../features/chat/services/ChatService';
import { IFollowDao } from '../features/follow/daos/IFollowDao';
import { FollowService } from '../features/follow/services/FollowService';

/**
 * registerServices function.
 *
 * This function registers all services and their dependencies in the dependency container.
 * Each service is registered with its name, a list of its dependencies, and a factory function that creates an instance of the service.
 *
 * The factory function takes the dependencies of the service as parameters and returns a new instance of the service.
 *
 * @param {IDependencyContainer} container - The dependency container.
 */

export const registerServices = (container: IDependencyContainer): void => {
  // Firebase JWT Service to verify Firebase JWT tokens
  container.register(
    Dep.FirebaseJWTService,
    [],
    () => new FirebaseJWTService()
  );
  // Socket Service to handle socket connections and events
  container.register(
    Dep.SocketService,
    [Dep.FirebaseJWTService, Dep.HttpServer, Dep.UserDao, Dep.Logger],
    (
      firebaseJWTService: IJWTService,
      httpServer: Server,
      userDao: IUserDao,
      logger: ILogger
    ) => new SocketService(firebaseJWTService, httpServer, userDao, logger)
  );
  // Post Service to handle post-related business operations
  container.register(
    Dep.PostService,
    [Dep.UserDao, Dep.PostDao, Dep.LikeDao, Dep.HashtagDao, Dep.SocketService],
    (
      userDao: IUserDao,
      postDao: IPostDao,
      likeDao: ILikeDao,
      hashtagDao: IHashtagDao,
      socketService: ISocketService
    ) => new PostService(userDao, postDao, likeDao, hashtagDao, socketService)
  );
  // Like Service
  container.register(
    Dep.LikeService,
    [Dep.PostDao, Dep.LikeDao, Dep.NotificationDao, Dep.SocketService],
    (
      postDao: IPostDao,
      likeDao: ILikeDao,
      notificationDao: INotificationDao,
      socketService: ISocketService
    ) => new LikeService(postDao, likeDao, notificationDao, socketService)
  );

  // Follow Service
  container.register(
    Dep.FollowService,
    [Dep.UserDao, Dep.FollowDao, Dep.NotificationDao, Dep.SocketService],
    (
      userDao: IUserDao,
      followDao: IFollowDao,
      notificationDao: INotificationDao,
      socketService: ISocketService
    ) => new FollowService(userDao, followDao, notificationDao, socketService)
  );

  // Chat Service
  container.register(
    Dep.ChatService,
    [Dep.ChatDao, Dep.SocketService],
    (chatDao: IChatDao, socketService: ISocketService) =>
      new ChatService(chatDao, socketService)
  );
};
