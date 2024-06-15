import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import { IPost } from '../../post/models/IPost';

/**
 *
 * Interface representing a CRUD controller for the likes resource api. Defines the controller operations of a like, including user likes/dislikes post, finding all users that liked a post, and finding all posts liked by a user.
 */
export interface ILikeController {
  userLikesPost(req: IHttpRequest): Promise<IHttpResponse<IPost>>;
  userUnlikesPost(req: IHttpRequest): Promise<IHttpResponse<IPost>>;
  findAllPostsLikedByUser(req: IHttpRequest): Promise<IHttpResponse<IPost[]>>;
}
