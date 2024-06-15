import { ServiceError } from '../../../common/errors/ServiceError';
import { IHashtagDao } from '../../hashtag/daos/IHashTagDao';
import { ILikeDao } from '../../like/daos/ILikeDao';
import { ISocketService } from '../../socket/services/ISocketService';
import { SocketEvents } from '../../socket/services/SocketEvents';
import { IUserDao } from '../../user/daos/IUserDao';
import { IUser } from '../../user/models/IUser';
import { IPostDao } from '../daos/IPostDao';
import { IPost } from '../models/IPost';
import { IPostService } from './IPostService';
import { FilterOptions } from '../../../common/interfaces/IBaseDao';

/**
 * Handles the business logic for the post feature. Takes the request data from the controller and sends it to the daos to process the request.
 */
export class PostService implements IPostService {
  private readonly userDao: IUserDao;
  private readonly postDao: IPostDao;
  private readonly likeDao: ILikeDao;
  private readonly hashtagDao: IHashtagDao;
  private readonly socketService: ISocketService;

  public constructor(
    userDao: IUserDao,
    postDao: IPostDao,
    likeDao: ILikeDao,
    hashtagDao: IHashtagDao,
    socketService: ISocketService
  ) {
    this.postDao = postDao;
    this.userDao = userDao;
    this.hashtagDao = hashtagDao;
    this.likeDao = likeDao;
    this.socketService = socketService;
    Object.freeze(this);
  }

  public create = async (post: IPost): Promise<IPost> => {
    const existingUser = await this.userDao.findById(post.author.id);
    if (!existingUser) {
      throw new ServiceError('Cannot create post. User does not exist.');
    }
    const newPost: IPost = await this.postDao.create(post);
    this.socketService.emitToAllUsers(SocketEvents.NEW_POST, newPost);
    return newPost;
  };

  public findById = async (id: string): Promise<IPost | null> =>
    await this.postDao.findById(id);

  public findAll = async (filter?: FilterOptions<IPost>): Promise<IPost[]> => {
    const posts: IPost[] = await this.postDao.findAll(filter);
    return posts;
  };

  public update = async (postId: string, data: IPost): Promise<IPost> => {
    const existingPost = await this.postDao.findById(postId);
    if (!existingPost) {
      throw new ServiceError(
        `Cannot update post. Post by ID ${postId} does not exist.`
      );
    }
    const updatedPost: IPost = await this.postDao.update(postId, data);
    this.socketService.emitToAllUsers(SocketEvents.UPDATE_POST, updatedPost);
    return updatedPost;
  };

  public findAllPostsByKeyword = async (
    hashtag: string,
    filter?: FilterOptions<IPost>
  ): Promise<IPost[]> => {
    const posts: IPost[] = await this.postDao.findAllPostsByKeyword(
      hashtag,
      filter
    );
    return posts;
  };

  public findAllPostsByAuthorId = async (
    userId: string,
    filter: FilterOptions<IPost>
  ): Promise<IPost[]> => {
    const user: IUser | null = await this.userDao.findById(userId);
    if (!user) {
      throw new ServiceError(
        `Cannot find posts. User by ID ${userId} does not exist.`
      );
    }
    const posts: IPost[] = await this.postDao.findAllPostsByAuthorId(
      userId,
      filter
    );
    return posts;
  };

  public delete = async (postId: string): Promise<boolean> => {
    const existingPost = await this.postDao.findById(postId);
    if (!existingPost) {
      throw new ServiceError(
        `Cannot delete post. Post does not exist. ID: ${postId}`
      );
    }
    const deleted: boolean = await this.postDao.delete(postId);
    if (deleted) {
      await this.hashtagDao.deleteManyByPostId(postId);
      await this.likeDao.deleteManyByPostId(postId);
    }
    this.socketService.emitToAllUsers(SocketEvents.DELETE_POST, postId);
    return deleted;
  };
}
