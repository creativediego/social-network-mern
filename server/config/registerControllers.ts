import { Express } from 'express';
import BookMarkController from '../controllers/bookmarks/BookmarkController';
import FollowController from '../controllers/follows/FollowController';
import LikeController from '../controllers/likes/LikeController';
import MessageController from '../controllers/messages/MessageController';
import PostController from '../controllers/posts/PostController';
import { UserController } from '../controllers/users/UserController';
import NotificationController from '../controllers/notifications/NotificationController';
import SearchController from '../controllers/search/SearchController';
import { IDependencyContainer } from './IDependencyContainer';
import { Dep } from './Dependencies';
import IBaseDao from '../daos/shared/IDao';
import IUser from '../models/users/IUser';
import { IJWTService } from '../services/IJWTService';
import IPost from '../models/posts/IPost';
import IFollowDao from '../daos/follows/IFollowDao';
import { ISocketService } from '../services/ISocketService';
import ILikeDao from '../daos/likes/ILikeDao';
import IMessageDao from '../daos/messages/IMessageDao';
import IBookMarkDao from '../daos/bookmarks/IBookmarkDao';
import SocketService from '../services/SocketService';
import FirebaseAuthController from '../controllers/auth/FirebaseAuthController';

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
  container.register(
    Dep.UserController,
    [Dep.App, Dep.UserDao],
    (app: Express, userDao: IBaseDao<IUser>) =>
      new UserController('/api/users', app, userDao)
  );

  container.register(
    Dep.AuthController,
    [Dep.App, Dep.UserDao, Dep.FirebaseJWTService],
    (app: Express, userDao: IBaseDao<IUser>, firebaseJWTService: IJWTService) =>
      new FirebaseAuthController('/api/auth', app, userDao, firebaseJWTService)
  );

  container.register(
    Dep.PostController,
    [Dep.App, Dep.PostDao, Dep.SocketService],
    (app: Express, postDao: IBaseDao<IPost>, socketService: SocketService) =>
      new PostController('/api', app, postDao, socketService)
  );

  container.register(
    Dep.BookmarkController,
    [Dep.App, Dep.BookmarkDao],
    (app: Express, bookmarkDao: IBookMarkDao) =>
      new BookMarkController('/api/users', app, bookmarkDao)
  );

  container.register(
    Dep.FollowController,
    [
      Dep.App,
      Dep.FollowDao,
      Dep.UserDao,
      Dep.NotificationDao,
      Dep.SocketService,
    ],
    (
      app: Express,
      followDao: IFollowDao,
      userDao: IBaseDao<IUser>,
      notificationDao,
      socketService: ISocketService
    ) =>
      new FollowController(
        '/api/users/',
        app,
        followDao,
        userDao,
        notificationDao,
        socketService
      )
  );

  container.register(
    Dep.LikeController,
    [Dep.App, Dep.LikeDao, Dep.NotificationDao, Dep.SocketService],
    (
      app: Express,
      likeDao: ILikeDao,
      notificationDao,
      socketService: ISocketService
    ) =>
      new LikeController('/api', app, likeDao, notificationDao, socketService)
  );

  container.register(
    Dep.MessageController,
    [Dep.App, Dep.MessageDao, Dep.SocketService],
    (app: Express, messageDao: IMessageDao, socketService: ISocketService) =>
      new MessageController('/api/chat', app, messageDao, socketService)
  );

  container.register(
    Dep.NotificationController,
    [Dep.App, Dep.NotificationDao, Dep.SocketService],
    (app: Express, notificationDao, socketService: ISocketService) =>
      new NotificationController('/api', app, notificationDao, socketService)
  );

  container.register(
    Dep.SearchController,
    [Dep.App, Dep.UserDao, Dep.PostDao],
    (app: Express, userDao: IBaseDao<IUser>, postDao: IBaseDao<IPost>) =>
      new SearchController('/api', app, userDao, postDao)
  );
};
