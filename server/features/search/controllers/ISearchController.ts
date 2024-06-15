import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import { IPost } from '../../post/models/IPost';
import { IUser } from '../../user/models/IUser';
import { ISearchResults } from '../models/ISearchResults';

/**
 * Controller for the search feature.
 */
export default interface ISearchController {
  findAll(req: IHttpRequest): Promise<IHttpResponse<ISearchResults>>;
  findAllPosts(req: IHttpRequest): Promise<IHttpResponse<IPost[]>>;
  findAllUsers(req: IHttpRequest): Promise<IHttpResponse<IUser[]>>;
}
