import IUser from '../users/IUser';

/**
 * Model interface for a post.
 */
export default interface IPost {
  post: string;
  author: IUser;
  stats?: {
    likes: number;
    dislikes: number;
    replies: number;
    reposts: number;
  };
  image?: string;
  gif?: string;
  postedDate?: Date;
  likedBy?: [];
  dislikedBy?: [];
  hashtags?: string[];
}
