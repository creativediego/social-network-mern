import ILikeDao from '../daos/likes/ILikeDao';
import { INotificationDao } from '../daos/notifications/NotificationDao';
import IPostDao from '../daos/posts/IPostDao';
import IBaseDao from '../daos/shared/IDao';
import { ServiceError } from '../errors/ServiceError';
import ILike from '../models/likes/ILike';
import { NotificationType } from '../models/notifications/NotificationType';
import IPost from '../models/posts/IPost';
import IUser from '../models/users/IUser';
import { ISocketService } from './ISocketService';

export interface ILikeService {
  userLikesPost(userLikingId: string, post: IPost): Promise<void>;
  userUnlikesPost(userUnlinking: string, post: IPost): Promise<void>;
  findAllPostsLikedByUser(user: Partial<IUser>): Promise<IPost[]>;
  findAllUsersWhoLikedPost(postId: string): Promise<IUser[]>;
}

export class LikeService implements ILikeService {
  private readonly postDao: IBaseDao<IPost>;
  private readonly likeDao: IBaseDao<ILike>;
  private readonly notificationDao: INotificationDao;
  private readonly socketService: ISocketService;

  constructor(
    postDao: IBaseDao<IPost>,
    likeDao: IBaseDao<ILike>,
    notificationDao: INotificationDao,
    socketService: ISocketService
  ) {
    this.postDao = postDao;
    this.likeDao = likeDao;
    this.notificationDao = notificationDao;
    this.socketService = socketService;
  }

  findAllUsersWhoLikedPost = async (postId: string): Promise<IUser[]> => {
    const post = await this.postDao.findOneById(postId);
    if (!post) {
      throw new ServiceError(
        'Post not found. Unable to find users who liked it.'
      );
    }
    const likes: ILike[] = await this.likeDao.findAll({ post: post });
    const users: IUser[] = [];
    likes.map((like) => {
      users.push(like.user);
    });
    return users;
  };

  findAllPostsLikedByUser = async (user: IUser): Promise<IPost[]> => {
    const likes: ILike[] = await this.likeDao.findAll({ user });
    const posts: IPost[] = [];
    likes.map((like) => {
      posts.push(like.post);
    });
    return posts;
  };

  async userLikesPost(userLiking: string, post: IPost): Promise<void> {
    const updatedPost = this.postDao.update(post.id, {
      ...post,
      stats: { ...post.stats, likes: post.stats.likes + 1 },
    });

    const existingNotification = await this.notificationDao.findNotification(
      NotificationType.LIKES,
      userLiking,
      post.author.id
    );

    if (!existingNotification) {
      const notification = await this.notificationDao.createNotification(
        NotificationType.LIKES,
        userLiking,
        post.author.id
      );

      this.socketService.emitToRoom(
        post.author.id,
        'NEW_NOTIFICATION',
        notification
      );
    }
    this.socketService.emitToRoom(post.author.id, 'UPDATE_POST', updatedPost);
  }

  async userUnlikesPost(userUnliking: string, post: IPost): Promise<void> {
    const updatedPost = this.postDao.update(post.id, {
      ...post,
      stats: { ...post.stats, likes: post.stats.likes - 1 },
    });

    const existingNotification = await this.notificationDao.findNotification(
      NotificationType.LIKES,
      userUnliking,
      post.author.id
    );

    if (existingNotification) {
      const notification = await this.notificationDao.deleteNotification(
        existingNotification.id
      );

      this.socketService.emitToRoom(
        post.author.id,
        'DELETE_NOTIFICATION',
        notification
      );
    }
    this.socketService.emitToRoom(post.author.id, 'UPDATE_POST', updatedPost);
  }
}
