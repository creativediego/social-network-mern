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
import ITuitController from '../controllers/tuits/ITuitController';
import TuitController from '../controllers/tuits/TuitController';
import { UserController } from '../controllers/users/UserController';
import NotificationController from '../controllers/notifications/NotificationController';
import SearchController from '../controllers/search/SearchController';
import {
  userDao,
  tuitDao,
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
import {
  jwtService,
  socketService,
  firebaseJWTService,
} from './configServices';
import ISearchController from '../controllers/search/ISearchController';

let alreadyCreated = false;
const hasher = new BcryptHasher(10);

/**
 * Instantiates all controllers.
 * @param app the express app to pass as dependency to controllers to declare routes.
 */
const createControllers = (app: Express): void => {
  if (alreadyCreated) {
    return;
  }
  const userController: IGenericController = new UserController(
    '/api/v1/users',
    app,
    userDao
  );
  const authController: IAuthController = new AuthController(
    app,
    userDao,
    hasher,
    firebaseJWTService
  );
  const tuitController: ITuitController = new TuitController(
    '/api/v1',
    app,
    tuitDao,
    socketService
  );
  const bookmarkController: IBookMarkController = new BookMarkController(
    '/api/v1/users',
    app,
    bookmarkDao
  );
  const followController: IFollowController = new FollowController(
    '/api/v1/users/',
    app,
    followDao,
    userDao,
    notificationDao,
    socketService
  );
  const likeController: ILikeController = new LikeController(
    '/api/v1/',
    app,
    likeDao,
    notificationDao,
    socketService
  );
  const messageController: IMessageController = new MessageController(
    '/api/v1/users',
    app,
    messageDao,
    socketService
  );

  const notificationController: NotificationController =
    new NotificationController('/api/v1', app, notificationDao, socketService);

  const searchController: ISearchController = new SearchController(
    '/api/v1',
    app,
    userDao,
    tuitDao
  );

  app.use(handleCentralError);
  alreadyCreated = true;
};

export default createControllers;
