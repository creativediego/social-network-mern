/**
 * Dep enum.
 *
 * This enum represents the dependencies in the application.
 * Each dependency is represented by a string value.
 *
 * The dependencies include services, controllers, and data access objects (DAOs).
 * Used to inject dependencies into the application.
 *
 * @enum {string}
 */
export enum Dep {
  App = 'app',
  isAuthenticated = 'isAuthenticated',
  HttpServer = 'httpServer',
  HashService = 'hashService',
  JWTService = 'jwtService',
  FirebaseJWTService = 'firebaseJWTService',
  SocketService = 'socketService',
  DaoErrorHandler = 'daoErrorHandler',
  UserDao = 'userDao',
  PostDao = 'postDao',
  FollowDao = 'followDao',
  LikeDao = 'likeDao',
  MessageDao = 'messageDao',
  NotificationDao = 'notificationDao',
  BookmarkDao = 'bookmarkDao',
  UserController = 'userController',
  AuthController = 'authController',
  PostController = 'postController',
  BookmarkController = 'bookmarkController',
  FollowController = 'followController',
  LikeController = 'likeController',
  MessageController = 'messageController',
  NotificationController = 'notificationController',
  SearchController = 'searchController',
}
