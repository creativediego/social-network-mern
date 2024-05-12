import { INotificationDao } from '../../notification/daos/NotificationDao';
import { ServiceError } from '../../../common/errors/ServiceError';
import { ILike } from '../models/ILike';
import { NotificationType } from '../../notification/models/NotificationType';
import { IPost } from '../../post/models/IPost';
import { IUser } from '../../user/models/IUser';
import { ISocketService } from '../../socket/services/ISocketService';
import { ILikeDao } from '../daos/ILikeDao';
import { IPostDao } from '../../post/daos/IPostDao';
import { SocketEvents } from '../../socket/services/SocketEvents';

export interface ILikeService {
  userLikesPost(userId: string, postId: string): Promise<IPost>;
  userUnlikesPost(userId: string, postId: string): Promise<IPost>;
  findAllPostsLikedByUser(userId: string): Promise<IPost[]>;
  // findAllUsersWhoLikedPost(postId: string): Promise<IUser[]>;
}

export class LikeService implements ILikeService {
  private readonly postDao: IPostDao;
  private readonly likeDao: ILikeDao;
  private readonly notificationDao: INotificationDao;
  private readonly socketService: ISocketService;

  constructor(
    postDao: IPostDao,
    likeDao: ILikeDao,
    notificationDao: INotificationDao,
    socketService: ISocketService
  ) {
    this.postDao = postDao;
    this.likeDao = likeDao;
    this.notificationDao = notificationDao;
    this.socketService = socketService;
  }

  public findAllPostsLikedByUser = async (userId: string): Promise<IPost[]> => {
    return await this.likeDao.findAllPostsLikedByUser(userId);
  };

  public userLikesPost = async (
    userId: string,
    postId: string
  ): Promise<IPost> => {
    // Check if post exists
    const existingPost = await this.postDao.findById(postId);
    if (!existingPost) {
      throw new ServiceError('Post not found.');
    }
    // Check if user has already liked the post
    const likedBy = existingPost.likedBy.map((id) => id.toString());
    if (likedBy.includes(userId)) {
      return existingPost;
    }
    // Create like
    await this.likeDao.createLike(userId, postId);
    // Update post stats
    const postToUpdate: Partial<IPost> = {
      likedBy: [...existingPost.likedBy, userId],
      stats: { ...existingPost.stats, likes: existingPost.stats.likes + 1 },
    };

    const updatedPost: IPost = await this.postDao.update(postId, postToUpdate);

    if (userId !== updatedPost.author.id) {
      const notification = await this.notificationDao.createNotification(
        NotificationType.LIKE,
        userId,
        updatedPost.author.id
      );

      this.socketService.emitToUser(
        updatedPost.author.id,
        SocketEvents.NEW_NOTIFICATION,
        notification
      );
    }

    this.socketService.emitToAllUsers(SocketEvents.UPDATE_POST, updatedPost);
    return updatedPost;
  };

  public userUnlikesPost = async (
    userId: string,
    postId: string
  ): Promise<IPost> => {
    const existingPost = await this.postDao.findById(postId);
    if (!existingPost) {
      throw new ServiceError('Post not found. Cannot unlike post.');
    }
    // Check if user has already liked the post
    const updatedPost = await this.postDao.update(postId, {
      likedBy: [
        ...existingPost.likedBy.filter((id) => id.toString() !== userId),
      ],
      stats: { ...existingPost.stats, likes: existingPost.stats.likes - 1 },
    });

    const notification = await this.notificationDao.findNotification(
      NotificationType.LIKE,
      userId,
      updatedPost.author.id
    );

    if (notification) {
      await this.notificationDao.deleteNotification(notification.id);
      this.socketService.emitToUser(
        updatedPost.author.id,
        SocketEvents.DELETE_NOTIFICATION,
        notification
      );
    }
    this.socketService.emitToAllUsers(SocketEvents.UPDATE_POST, updatedPost);
    return updatedPost;
  };
}
