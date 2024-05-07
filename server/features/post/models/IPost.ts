import { IUser } from '../../user/models/IUser';

/**
 * Model interface for a post.
 */
export interface IPost {
  id: string;
  post: string;
  author: IUser;
  stats: {
    likes: number;
    dislikes: number;
    replies: number;
    reposts: number;
  };
  image?: string;
  gif?: string;
  likedBy: string[];
  dislikedBy: string[];
  hashtags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
