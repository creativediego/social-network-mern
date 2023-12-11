import { Express } from 'express';
import BookMarkController from '../controllers/bookmarks/BookmarkController';
import IBookMarkController from '../controllers/bookmarks/IBookmarkController';
import FollowController from '../controllers/follows/FollowController';
import IFollowController from '../controllers/follows/IFollowController';
import ILikeController from '../controllers/likes/ILikeController';
import LikeController from '../controllers/likes/LikeController';
import IMessageController from '../controllers/messages/IMessageController';
import MessageController from '../controllers/messages/MessageController';
import IGenericController from '../controllers/shared/IGenericController';
import IPostController from '../controllers/posts/IPostController';
import PostController from '../controllers/posts/PostController';
import { UserController } from '../controllers/users/UserController';
import NotificationController from '../controllers/notifications/NotificationController';
import SearchController from '../controllers/search/SearchController';
import {
  userDao,
  postDao,
  bookmarkDao,
  likeDao,
  followDao,
  messageDao,
  notificationDao,
} from './configDaos';
import BcryptHasher from '../controllers/auth/BcryptHasher';
import { handleCentralError } from '../errors/handleCentralError';
import AuthController from '../controllers/auth/AuthController';
import IAuthController from '../controllers/auth/IAuthController';
import { socketService, firebaseJWTService } from './configServices';
import ISearchController from '../controllers/search/ISearchController';

let alreadyCreated = false;
const hasher = new BcryptHasher(10);

/**
 * Instantiates all controllers.
 * @param app the express app to pass as dependency to controllers to declare routes.
 */
export const createControllers = (app: Express): void => {
  if (alreadyCreated) {
    return;
  }
  const userController: IGenericController = new UserController(
    '/api/users',
    app,
    userDao
  );
  const authController: IAuthController = new AuthController(
    app,
    userDao,
    hasher,
    firebaseJWTService
  );
  const postController: IPostController = new PostController(
    '/api',
    app,
    postDao,
    socketService
  );
  const bookmarkController: IBookMarkController = new BookMarkController(
    '/api/users',
    app,
    bookmarkDao
  );
  const followController: IFollowController = new FollowController(
    '/api/users/',
    app,
    followDao,
    userDao,
    notificationDao,
    socketService
  );
  const likeController: ILikeController = new LikeController(
    '/api',
    app,
    likeDao,
    notificationDao,
    socketService
  );
  const messageController: IMessageController = new MessageController(
    '/api/users',
    app,
    messageDao,
    socketService
  );

  const notificationController: NotificationController =
    new NotificationController('/api', app, notificationDao, socketService);

  const searchController: ISearchController = new SearchController(
    '/api',
    app,
    userDao,
    postDao
  );

  app.use(handleCentralError);
  alreadyCreated = true;
};
