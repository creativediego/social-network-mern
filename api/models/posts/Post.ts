import InvalidEntityException from '../../errors/InvalidEntityException';
import IUser from '../users/IUser';
import IPost from './IPost';

/**
 * Represents a post. Implements the {@link IPost} model interface. A post has an author, posted date, like, and reply count.
 */
export default class Post implements IPost {
  public readonly post: string;
  public readonly author: IUser;
  likeCount: number = 0;
  replyCount: number = 0;

  /**
   * Constructs the post entity with post content, posted date, and optional author
   * @param {string} post the contents of the post
   * @param {string} postedDate
   * @param {IUser} author
   */
  public constructor(post: string, author: IUser) {
    this.validatePost(post);
    this.author = author;
    this.post = post;
    Object.freeze(this);
  }

  validatePost = (post: string) => {
    if (!post || post.length < 2 || post.length > 160) {
      throw new InvalidEntityException(
        'Posts must be greater than 2 characters and less than 260.'
      );
    }
  };
}
