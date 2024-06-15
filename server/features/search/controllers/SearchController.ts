import { IPost } from '../../post/models/IPost';
import { IUser } from '../../user/models/IUser';
import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import ISearchController from './ISearchController';
import { okResponse } from '../../../common/util/httpResponses';
import { IPostDao } from '../../post/daos/IPostDao';
import { IUserDao } from '../../user/daos/IUserDao';
import { ISearchResults } from '../models/ISearchResults';
import { ILogger } from '../../../common/logger/ILogger';

/**
 * Controller for the search feature. Handles the request data and sends it to the search dao to process the request.
 */
export default class SearchController implements ISearchController {
  private readonly userDao: IUserDao;
  private readonly postDao: IPostDao;

  public constructor(userDao: IUserDao, postDao: IPostDao) {
    this.userDao = userDao;
    this.postDao = postDao;

    Object.freeze(this);
  }
  findAll = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<ISearchResults>> => {
    const keyword = req.params.keyword;
    const posts: IPost[] = await this.postDao.findAllPostsByKeyword(keyword);
    const users: IUser[] = await this.userDao.findAllUsersByKeyword(keyword);
    return okResponse({ users, posts });
  };
  findAllPosts = async (req: IHttpRequest): Promise<IHttpResponse<IPost[]>> => {
    const keyword = req.params.keyword;
    const posts: IPost[] = await this.postDao.findAllPostsByKeyword(keyword);
    return okResponse(posts);
  };
  findAllUsers = async (req: IHttpRequest): Promise<IHttpResponse<IUser[]>> => {
    const keyword = req.params.keyword;
    const users: IUser[] = await this.userDao.findAllUsersByKeyword(keyword);
    return okResponse(users);
  };
}
