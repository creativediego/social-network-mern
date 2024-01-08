import IBaseDao from '../../daos/shared/IDao';
import IPost from '../../models/posts/IPost';
import IUser from '../../models/users/IUser';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import ISearchController from './ISearchController';
import { Express, Router } from 'express';
import { isAuthenticated } from '../auth/isAuthenticated';
import { okResponse } from '../shared/createResponse';
import { adaptRequest } from '../shared/adaptRequest';

export default class SearchController implements ISearchController {
  private readonly userDao: IBaseDao<IUser>;
  private readonly postDao: IBaseDao<IPost>;
  public constructor(
    path: string,
    app: Express,
    userDao: IBaseDao<IUser>,
    postDao: IBaseDao<IPost>
  ) {
    this.userDao = userDao;
    this.postDao = postDao;
    const router: Router = Router();
    router.get('/search/:keyword', isAuthenticated, adaptRequest(this.findAll));
    router.get(
      '/search/posts/:keyword',
      isAuthenticated,
      adaptRequest(this.findAllPosts)
    );
    router.get(
      '/search/users/:keyword',
      isAuthenticated,
      adaptRequest(this.findAllUsers)
    );
    app.use(path, router);
    Object.freeze(this);
  }
  findAll = async (req: HttpRequest): Promise<HttpResponse> => {
    const keyword = req.params.keyword;
    const posts: IPost[] = await this.postDao.findAllByField(keyword);
    const users: IUser[] = await this.userDao.findAllByField(keyword);
    return okResponse({ users, posts });
  };
  findAllPosts = async (req: HttpRequest): Promise<HttpResponse> => {
    const keyword = req.params.keyword;
    const posts: IPost[] = await this.postDao.findAllByField(keyword);
    return okResponse({ posts });
  };
  findAllUsers = async (req: HttpRequest): Promise<HttpResponse> => {
    const keyword = req.params.keyword;
    const users: IUser[] = await this.userDao.findAllByField(keyword);
    return okResponse({ users });
  };
}
