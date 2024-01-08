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
import IBaseDao from '../../daos/shared/IDao';
import { INotificationDao } from '../../daos/notifications/NotificationDao';
import { INotification } from '../../models/notifications/INotification';
import { NotificationType } from '../../models/notifications/NotificationType';
import { ISocketService } from '../../services/ISocketService';
import IUser from '../../models/users/IUser';
import ILike from '../../models/likes/ILike';
import { ILikeService } from '../../services/LikeService';

/**
 * Represents the implementation of an ILikeController interface for handling the likes resource api.
 */
export default class LikeController implements ILikeController {
  private readonly likeService: ILikeService;

  /** Constructs the like controller with an injected ILikeDao interface implementation. Defines the endpoint paths, middleware, method types, and handler methods associated with each endpoint.
   *
   * @param {ILikeDao} likeDao a like dao implementing the ILikeDao interface used to find resources in the database.
   */
  constructor(path: string, app: Express, likeService: ILikeService) {
    this.likeService = likeService;
    const router = Router();
    router.get(
      '/users/:userId/likes',
      isAuthenticated,
      adaptRequest(this.findAllPostsLikedByUser)
    );
    router.get(
      '/posts/:postId/likes',
      isAuthenticated,
      adaptRequest(this.findAllUsersWhoLikedPost)
    );
    router.post(
      '/posts/:postId/likes',
      isAuthenticated,
      adaptRequest(this.userLikesPost)
    );
    router.post(
      '/posts/:postId/dislikes',
      isAuthenticated,
      adaptRequest(this.userUnlikesPost)
    );
    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }

  userLikesPost = async (req: HttpRequest): Promise<HttpResponse> => {
    const updatedPost = await this.likeService.userLikesPost(
      req.user.id,
      req.body.post
    );
    return okResponse(updatedPost);
  };

  userUnlikesPost = async (req: HttpRequest): Promise<HttpResponse> => {
    const updatedPost = await this.likeService.userUnlikesPost(
      req.user.id,
      req.body.post
    );

    return okResponse(updatedPost);
  };

  /**
   * Processes request to find all users who liked a post. Sends an array of users who liked the post back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAllUsersWhoLikedPost = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    const users: IUser[] = await this.likeService.findAllUsersWhoLikedPost(
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
    const likedPosts: IPost[] = await this.likeService.findAllPostsLikedByUser(
      req.params.userId
    );
    return okResponse(likedPosts);
  };
}
