import { Socket } from 'socket.io';
import { ServiceError } from '../../../common/errors/ServiceError';
import { ISocketService } from '../../socket/services/ISocketService';
import { IUserDao } from '../../user/daos/IUserDao';
import { IFollowDao } from '../daos/IFollowDao';
import { IFollow } from '../models/IFollow';
import { IFollowService } from './IFollowService';
import { SocketEvents } from '../../socket/services/SocketEvents';
import { INotificationDao } from '../../notification/daos/NotificationDao';
import { NotificationType } from '../../notification/models/NotificationType';

export class FollowService implements IFollowService {
  private readonly userDao: IUserDao;
  private readonly followDao: IFollowDao;
  private readonly notificationDao: INotificationDao;
  private readonly socketService: ISocketService;

  public constructor(
    userDao: IUserDao,
    followDao: IFollowDao,
    notificationDao: INotificationDao,
    socketService: ISocketService
  ) {
    this.followDao = followDao;
    this.notificationDao = notificationDao;
    this.socketService = socketService;
    this.userDao = userDao;
    Object.freeze(this);
  }

  public acceptFollow = async (
    followerId: string,
    followeeId: string
  ): Promise<IFollow | null> => {
    const acceptedFollow: IFollow | null = await this.followDao.updateFollow(
      followerId,
      followeeId,
      { accepted: true }
    );

    if (!acceptedFollow) {
      return null;
    }

    this.socketService.emitToUser(
      followeeId,
      SocketEvents.NEW_NOTIFICATION,
      acceptedFollow
    );
    return acceptedFollow;
  };

  public findFollow = async (
    followerId: string,
    followeeId: string
  ): Promise<IFollow | null> =>
    await this.followDao.findFollow(followerId, followeeId);

  public createFollow = async (
    followerId: string,
    followeeId: string
  ): Promise<number> => {
    // Check if follow exists already
    const existingFollow = await this.followDao.findFollow(
      followerId,
      followeeId
    );
    if (existingFollow) {
      return existingFollow.followee.followerCount;
    }
    // Check if follower and followee exist
    const follower = await this.userDao.findById(followerId);
    const followee = await this.userDao.findById(followeeId);
    if (!follower || !followee) {
      throw new ServiceError('Cannot create follow. User does not exist.');
    }

    // Create new follow
    const newFollow: IFollow = await this.followDao.createFollow(
      followerId,
      followeeId
    );

    // Update the follower and followee counts
    const updatedFollowee = await this.userDao.update(followeeId, {
      followerCount: followee.followerCount + 1,
    });

    // Create a new notification for the follow
    const notification = await this.notificationDao.createNotification(
      NotificationType.FOLLOW,
      followerId,
      followeeId
    );

    // Emit a new update to the Socket server when a new follow notification is created
    this.socketService.emitToUser(
      followeeId,
      SocketEvents.NEW_NOTIFICATION,
      notification
    );

    return updatedFollowee.followerCount;
  };

  public deleteFollow = async (
    followerId: string,
    followeeId: string
  ): Promise<number> => {
    // Check if follower and followee exist
    const follower = await this.userDao.findById(followerId);
    const followee = await this.userDao.findById(followeeId);
    if (!follower || !followee) {
      throw new ServiceError('Cannot create follow. User does not exist.');
    }

    const deletedFollow = await this.followDao.deleteFollow(
      followerId,
      followeeId
    );

    if (!deletedFollow) {
      throw new ServiceError('Follow not found to delete.');
    }

    // Update the follower and followee counts
    const updatedFollowee = await this.userDao.update(followeeId, {
      followerCount: followee.followerCount - 1,
    });

    const notification = await this.notificationDao.findNotification(
      NotificationType.FOLLOW,
      followerId,
      followeeId
    );

    if (notification) {
      const deletedNotification = await this.notificationDao.deleteNotification(
        notification.id
      );

      // Emit a new update to the Socket server when a new follow notification is created
      this.socketService.emitToUser(
        followeeId,
        SocketEvents.DELETE_NOTIFICATION,
        notification
      );
    }

    return updatedFollowee.followerCount;
  };
}
