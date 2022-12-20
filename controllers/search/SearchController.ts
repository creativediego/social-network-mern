import IDao from '../../daos/shared/IDao';
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
  private readonly userDao: IDao<IUser>;
  private readonly tuitDao: IDao<IPost>;
  public constructor(
    path: string,
    app: Express,
    userDao: IDao<IUser>,
    tuitDao: IDao<IPost>
  ) {
    this.userDao = userDao;
    this.tuitDao = tuitDao;
    const router: Router = Router();
    router.get('/search/:keyword', isAuthenticated, adaptRequest(this.findAll));
    router.get(
      '/search/tuits/:keyword',
      isAuthenticated,
      adaptRequest(this.findAllTuits)
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
    const tuits: IPost[] = await this.tuitDao.findAllByField(keyword);
    const users: IUser[] = await this.userDao.findAllByField(keyword);
    return okResponse({ users, tuits });
  };
  findAllTuits = async (req: HttpRequest): Promise<HttpResponse> => {
    const keyword = req.params.keyword;
    const tuits: IPost[] = await this.tuitDao.findAllByField(keyword);
    return okResponse({ tuits });
  };
  findAllUsers = async (req: HttpRequest): Promise<HttpResponse> => {
    const keyword = req.params.keyword;
    const users: IUser[] = await this.userDao.findAllByField(keyword);
    return okResponse({ users });
  };
}
