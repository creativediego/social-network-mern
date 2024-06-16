import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import { ILikeController } from './ILikeController';
import { okResponse } from '../../../common/util/httpResponses';
import { IPost } from '../../post/models/IPost';
import { ILikeService } from '../services/LikeService';
import { ILogger } from '../../../common/logger/ILogger';

/**
 * Controller for the like feature. Handles the request data and sends it to the like service to process the request.
 * Uses the logger to log the request data and LikeService to process the request.
 */
export class LikeController implements ILikeController {
  private readonly likeService: ILikeService;
  private readonly logger: ILogger;

  constructor(likeService: ILikeService, logger: ILogger) {
    this.likeService = likeService;
    this.logger = logger;

    Object.freeze(this); // Make this object immutable.
  }

  userLikesPost = async (req: IHttpRequest): Promise<IHttpResponse<IPost>> => {
    const updatedPost: IPost = await this.likeService.userLikesPost(
      req.user.id,
      req.params.postId
    );
    this.logger.info(
      `User ${req.user.username} liked post ${req.params.postId}`
    );
    return okResponse(updatedPost);
  };

  userUnlikesPost = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IPost>> => {
    const updatedPost = await this.likeService.userUnlikesPost(
      req.user.id,
      req.params.postId
    );

    this.logger.info(
      `User ${req.user.username} unliked post ${updatedPost.id}`
    );
    return okResponse(updatedPost);
  };

  /**
   * Processes the request of finding all all posts that a particular user has liked. Calls the like dao to find the posts, and returns the posts back to the client.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  findAllPostsLikedByUser = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IPost[]>> => {
    const likedPosts: IPost[] = await this.likeService.findAllPostsLikedByUser(
      req.params.userId
    );
    this.logger.info(
      `User ${req.user.username} fetched posts liked by user: ${req.params.userId}`
    );
    return okResponse(likedPosts);
  };
}