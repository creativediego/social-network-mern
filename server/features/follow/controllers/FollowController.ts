import { IFollow } from '../models/IFollow';
import {
  noContentResponse,
  okResponse,
} from '../../../common/util/httpResponses';
import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import IFollowController from './IFollowController';
import { IFollowService } from '../services/IFollowService';
import { ILogger } from '../../../common/logger/ILogger';
import { ControllerError } from '../../../common/errors/ControllerError';

/**
 *  Represents controller CRUD operations for the follow feature. Implements {@link IFollowController}. Takes {@link IFollowService} as dependency to perform business logic operations.
 */
export default class FollowController implements IFollowController {
  private readonly followService: IFollowService;
  private readonly logger: ILogger;
  /**
   * Constructs the controller with a follow service.
   * @param {IFollowService} followService an implementation of a follow Service
   */
  public constructor(followService: IFollowService, logger: ILogger) {
    this.followService = followService;
    this.logger = logger;
  }
  acceptFollow = async (req: IHttpRequest): Promise<IHttpResponse<IFollow>> => {
    const followerId = req.body.followerId;
    const followeeId = req.body.followeeId;
    const acceptedFollow: IFollow | null =
      await this.followService.acceptFollow(followerId, followeeId);
    if (!acceptedFollow) {
      throw new ControllerError(
        `Failed to accept follow between users ${followerId} ${followeeId}.`,
        404
      );
    }
    return okResponse(acceptedFollow);
  };
  /**
   * Calls the follow dao in state to create a new follow using the follower and followee id.
   * @param {IHttpRequest} req the request object containing client data
   * @returns {IHttpResponse} a response object with the new follow
   */
  public createFollow = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<number>> => {
    const followerId = req.user.id;
    const followeeId = req.params.userId;
    console.log('followerId', followerId);
    console.log('followeeId', followeeId);
    const followerCount = await this.followService.createFollow(
      followerId,
      followeeId
    );
    this.logger.info(`User ${req.user.username} followed user ${followeeId}.`);
    return okResponse(followerCount);
  };

  /**
   * Calls the follow dao in state to delete a follow using the the user and follow object id.
   * @param {IHttpRequest} req the request object containing client data
   * @returns {IHttpResponse} a response object with the deleted follow
   */
  public deleteFollow = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<number>> => {
    const followerId = req.user.id;
    const followeeId = req.params.userId;
    const followerCount: number = await this.followService.deleteFollow(
      followerId,
      followeeId
    );

    this.logger.info(
      `User ${req.user.username} unfollowed user ${followeeId}.`
    );
    return okResponse(followerCount);
  };

  public findFollow = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<boolean>> => {
    const followerId: string = req.user.id;
    const followeeId: string = req.params.userId;
    console.log('finding follow', req.body);
    const follow: IFollow | null = await this.followService.findFollow(
      followerId,
      followeeId
    );
    console.log('finding follow results:', follow);
    if (!follow) {
      return okResponse(false);
    }
    this.logger.info(
      `User ${req.user.username} found follow between users ${followerId} and ${followeeId}.`
    );

    return okResponse(true);
  };
}
