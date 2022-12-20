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
      adaptRequest(this.findAllTuitsLikedByUser)
    );
    router.get(
      '/users/:userId/dislikes',
      isAuthenticated,
      adaptRequest(this.findAllTuitsDislikedByUser)
    );
    router.get(
      '/tuits/:tuitId/likes',
      isAuthenticated,
      adaptRequest(this.findAllUsersByTuitLike)
    );
    router.post(
      '/users/:userId/tuits/:tuitId/likes',
      isAuthenticated,

      adaptRequest(this.userLikesTuit)
    );
    router.post(
      '/users/:userId/tuits/:tuitId/dislikes',
      isAuthenticated,
      adaptRequest(this.userDislikesTuit)
    );
    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }
  /**
   * Processes the endpoint request of a user liking a tuit by calling the likeDao, which will create and return a like document. Sends the liked tuit back to the client with a success status. Passes any caught errors to the next function to be handled by the central error middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  userLikesTuit = async (req: HttpRequest): Promise<HttpResponse> => {
    const userId = req.user.id;
    const tuitId = req.params.tuitId;
    const existingLike: any = await this.likeDao.findLike(userId, tuitId);
    const existingDislike = await this.likeDao.findDislike(userId, tuitId);

    if (existingLike) {
      //undo previous like
      const updatedTuit: IPost = await this.likeDao.deleteLike(userId, tuitId);
      return okResponse(updatedTuit);
    }
    // new like
    let updatedTuit: any = await this.likeDao.createLike(userId, tuitId);

    // create the notification for the new like
    const notification: any = {
      type: NotificationType.LIKES,
      userNotified: updatedTuit.author.id.toString(),
      userActing: userId,
      resourceId: tuitId,
    };
    let likeNotification: INotification =
      await this.notificationDao.createNotification(notification);

    // Emit an update to the socket server that there's a new like notification
    // check if author of tuit is not logged in user
    if (req.user.id !== updatedTuit.author.id.toString()) {
      this.socketService.emitToRoom(
        updatedTuit.author.id.toString(),
        'NEW_NOTIFICATION',
        likeNotification
      );
    }

    if (existingDislike) {
      // undo previous dislike
      updatedTuit = await this.likeDao.deleteDislike(userId, tuitId);
    }

    return okResponse(updatedTuit);
  };
  /**
   * Processes the update request of a user unliking a tuit. Calls the like dao to remove the the like object associated with a tuit, and returns the tuit back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  userDislikesTuit = async (req: HttpRequest): Promise<HttpResponse> => {
    const userId = req.user.id;
    const tuitId = req.params.tuitId;
    const existingLike = await this.likeDao.findLike(userId, tuitId);
    const existingDislike = await this.likeDao.findDislike(userId, tuitId);

    if (existingDislike) {
      // undo dislike
      const updatedTuit: IPost = await this.likeDao.deleteDislike(
        userId,
        tuitId
      );
      return okResponse(updatedTuit);
    }
    // new dislike
    let updatedTuit: IPost = await this.likeDao.createDislike(userId, tuitId);

    if (existingLike) {
      // undo previous like
      updatedTuit = await this.likeDao.deleteLike(userId, tuitId);
    }

    return okResponse(updatedTuit);
  };

  /**
   * Processes request to find all users who liked a tuit. Sends an array of users who liked the tuit back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAllUsersByTuitLike = async (req: HttpRequest): Promise<HttpResponse> => {
    const users: IUser[] = await this.likeDao.findAllUsersByTuitLike(
      req.params.tuitId
    );
    return okResponse(users);
  };

  /**
   * Processes the request of finding all all tuits that a particular user has liked. Calls the like dao to find the tuits, and returns the tuits back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAllTuitsLikedByUser = async (req: HttpRequest): Promise<HttpResponse> => {
    const likedTuits: IPost[] = await this.likeDao.findAllTuitsLikedByUser(
      req.params.userId
    );
    return okResponse(likedTuits);
  };

  findAllTuitsDislikedByUser = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    const likedTuits: IPost[] = await this.likeDao.findAllTuitsDislikedByUser(
      req.params.userId
    );
    return okResponse(likedTuits);
  };
}
