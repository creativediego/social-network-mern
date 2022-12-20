import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import IGenericController from '../shared/IGenericController';

/**
 *
 * Interface representing a CRUD controller for the likes resource api. Defines the controller operations of a like, including user likes/dislikes post, finding all users that liked a post, and finding all posts liked by a user.
 */
export default interface ILikeController {
  userLikesPost(req: HttpRequest): Promise<HttpResponse>;
  userDislikesPost(req: HttpRequest): Promise<HttpResponse>;
  findAllUsersByPostLike(req: HttpRequest): Promise<HttpResponse>;
  findAllPostsLikedByUser(req: HttpRequest): Promise<HttpResponse>;
  findAllPostsDislikedByUser(req: HttpRequest): Promise<HttpResponse>;
}
