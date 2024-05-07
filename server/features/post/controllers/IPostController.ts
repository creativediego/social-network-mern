import { IBaseController } from '../../../common/interfaces/IBaseController';

import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IPost } from '../models/IPost';

/**
 * Represents the interface functionality of a post controller to handle requests and responses for the post resource.
 */
export interface IPostController extends IBaseController<IPost> {
  findAllPostsByAuthorId(req: IHttpRequest): Promise<IHttpResponse<IPost[]>>;
  findAllPostsByKeyword(req: IHttpRequest): Promise<IHttpResponse<IPost[]>>;
}
