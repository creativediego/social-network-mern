/**
 * Dependency enum.
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
  HttpServer = 'httpServer',
  Logger = 'logger',
  UserDao = 'userDao',
  PostDao = 'postDao',
  HashtagDao = 'hashtagDao',
  FollowDao = 'followDao',
  LikeDao = 'likeDao',
  ChatDao = 'chatDao',
  NotificationDao = 'notificationDao',
  BookmarkDao = 'bookmarkDao',
  FirebaseJWTService = 'firebaseJWTService',
  SocketService = 'socketService',
  PostService = 'postService',
  LikeService = 'likeService',
  FollowService = 'followService',
  ChatService = 'chatService',
  UserController = 'userController',
  AuthController = 'authController',
  PostController = 'postController',
  BookmarkController = 'bookmarkController',
  FollowController = 'followController',
  LikeController = 'likeController',
  ChatController = 'chatController',
  NotificationController = 'notificationController',
  SearchController = 'searchController',
}
