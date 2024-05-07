import { IPost } from '../../post/models/IPost';

/**
 * Model interface for a like.
 */
export interface IHashtag {
  hashtag: string;
  post: IPost;
}
