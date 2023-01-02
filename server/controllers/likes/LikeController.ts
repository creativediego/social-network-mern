import ILikeDao from '../../daos/likes/ILikeDao';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import ILikeController from './ILikeController';
import { Express, Router } from 'express';
import { Server } from 'socket.io';
import { adaptRequest } from '../shared/adaptRequest';
import { okResponse as okResponse } from '../shared/createResponse';
import { isAuthenticated } from '../auth/isAuthenticated';
import IPost from '../../models/posts/IPost';
import IDao from '../../daos/shared/IDao';
import NotificationDao from '../../daos/notifications/NotificationsDao';
import INotification from '../../models/notifications/INotification';
import { NotificationType } from '../../models/notifications/NotificationType';
import ISocketService from '../../services/ISocketService';
import IUser from '../../models/users/IUser';

/**
 * Represents the implementation of an ILikeController interface for handling the likes resource api.
 */
export default class LikeController implements ILikeController {
  private readonly likeDao: ILikeDao;
  private readonly socketService: ISocketService;
  private readonly notificationDao: NotificationDao;

  /** Constructs the like controller with an injected ILikeDao interface implementation. Defines the endpoint paths, middleware, method types, and handler methods associated with each endpoint.
   *
   * @param {ILikeDao} likeDao a like dao implementing the ILikeDao interface used to find resources in the database.
   */
  constructor(
    path: string,
    app: Express,
    likeDao: ILikeDao,
    notificationDao: NotificationDao,
    socketService: ISocketService
  ) {
    this.likeDao = likeDao;

    this.notificationDao = notificationDao;
    this.socketService = socketService;
    const router = Router();
    router.get(
      '/users/:userId/likes',
      isAuthenticated,
      adaptRequest(this.findAllPostsLikedByUser)
    );
    router.get(
      '/users/:userId/dislikes',
      isAuthenticated,
      adaptRequest(this.findAllPostsDislikedByUser)
    );
    router.get(
      '/posts/:postId/likes',
      isAuthenticated,
      adaptRequest(this.findAllUsersByPostLike)
    );
    router.post(
      '/users/:userId/posts/:postId/likes',
      isAuthenticated,

      adaptRequest(this.userLikesPost)
    );
    router.post(
      '/users/:userId/posts/:postId/dislikes',
      isAuthenticated,
      adaptRequest(this.userDislikesPost)
    );
    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }
  /**
   * Processes the endpoint request of a user liking a post by calling the likeDao, which will create and return a like document. Sends the liked post back to the client with a success status. Passes any caught errors to the next function to be handled by the central error middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  userLikesPost = async (req: HttpRequest): Promise<HttpResponse> => {
    const userId = req.user.id;
    const postId = req.params.postId;
    const existingLike: any = await this.likeDao.findLike(userId, postId);
    const existingDislike = await this.likeDao.findDislike(userId, postId);

    if (existingLike) {
      //undo previous like
      const updatedPost: IPost = await this.likeDao.deleteLike(userId, postId);
      this.socketService.emitToAll('UPDATED_POST', updatedPost);
      return okResponse(updatedPost);
    }
    // new like
    let updatedPost: any = await this.likeDao.createLike(userId, postId);

    // create the notification for the new like
    const notification: any = {
      type: NotificationType.LIKES,
      userNotified: updatedPost.author.id.toString(),
      userActing: userId,
      resourceId: postId,
    };
    if (notification.userActing !== notification.userNotified) {
      let likeNotification: INotification =
        await this.notificationDao.createNotification(notification);

      // Emit an update to the socket server that there's a new like notification
      // check if author of post is not logged in user
      this.socketService.emitToRoom(
        updatedPost.author.id.toString(),
        'NEW_NOTIFICATION',
        { likeNotification }
      );
    }

    if (existingDislike) {
      // undo previous dislike
      updatedPost = await this.likeDao.deleteDislike(userId, postId);
    }
    // Send updated post to all users.
    this.socketService.emitToAll('UPDATED_POST', updatedPost);
    return okResponse(updatedPost);
  };
  /**
   * Processes the update request of a user unliking a post. Calls the like dao to remove the the like object associated with a post, and returns the post back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  userDislikesPost = async (req: HttpRequest): Promise<HttpResponse> => {
    const userId = req.user.id;
    const postId = req.params.postId;
    const existingLike = await this.likeDao.findLike(userId, postId);
    const existingDislike = await this.likeDao.findDislike(userId, postId);

    if (existingDislike) {
      // undo dislike
      const updatedPost: IPost = await this.likeDao.deleteDislike(
        userId,
        postId
      );
      // Send updated post to all users.
      this.socketService.emitToAll('UPDATED_POST', updatedPost);
      return okResponse(updatedPost);
    }
    // new dislike
    let updatedPost: IPost = await this.likeDao.createDislike(userId, postId);

    if (existingLike) {
      // undo previous like
      updatedPost = await this.likeDao.deleteLike(userId, postId);
    }

    this.socketService.emitToAll('UPDATED_POST', updatedPost);
    return okResponse(updatedPost);
  };

  /**
   * Processes request to find all users who liked a post. Sends an array of users who liked the post back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAllUsersByPostLike = async (req: HttpRequest): Promise<HttpResponse> => {
    const users: IUser[] = await this.likeDao.findAllUsersByPostLike(
      req.params.postId
    );
    return okResponse(users);
  };

  /**
   * Processes the request of finding all all posts that a particular user has liked. Calls the like dao to find the posts, and returns the posts back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAllPostsLikedByUser = async (req: HttpRequest): Promise<HttpResponse> => {
    const likedPosts: IPost[] = await this.likeDao.findAllPostsLikedByUser(
      req.params.userId
    );
    return okResponse(likedPosts);
  };

  findAllPostsDislikedByUser = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    const likedPosts: IPost[] = await this.likeDao.findAllPostsDislikedByUser(
      req.params.userId
    );
    return okResponse(likedPosts);
  };
}
