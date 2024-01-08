import IGenericController from '../shared/IGenericController';
import IBaseDao from '../../daos/shared/IDao';
import IUser from '../../models/users/IUser';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import { notFound, okResponse } from '../shared/createResponse';
import { Express, Router } from 'express';
import { adaptRequest } from '../shared/adaptRequest';
import { isAuthenticated } from '../auth/isAuthenticated';
import { validateProfile } from '../middleware/validateUser';
import { validateResults } from '../middleware/validateResults';

/**
 * Processes the requests and responses dealing with the user resource. Implements {@link IController}.
 */
export class UserController implements IGenericController {
  private readonly dao: IBaseDao<IUser>;

  /**
   * Constructs the user controller by calling the super abstract, setting the dao, and configuring the endpoint paths.
   * @param dao a user dao that implements {@link IBaseDao}
   */

  public constructor(path: string, app: Express, dao: IBaseDao<IUser>) {
    this.dao = dao;
    const router = Router();
    router.get('/', adaptRequest(this.findAll));
    router.post('/:username', adaptRequest(this.findAllByUsername));
    // router.post('/', validateProfile, adaptRequest(this.create));
    router.get('/:userId', adaptRequest(this.findById));
    router.get('/profile/:username', adaptRequest(this.findOneByUsername));
    router.put(
      '/:userId',
      isAuthenticated,
      validateProfile,
      validateResults,
      adaptRequest(this.update)
    );
    router.delete('/:userId', adaptRequest(this.delete));
    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Calls the dao to find all users and returns them in the response. Passes errors to the next middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAll = async (): Promise<HttpResponse> => {
    const allUsers: IUser[] = await this.dao.findAll();
    return okResponse(allUsers);
  };

  /**
   * Takes the user id from the request params and calls the dao to find the user. Sends the user back to the client, or passes any errors to the next middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findById = async (req: HttpRequest): Promise<HttpResponse> => {
    const dbUser: IUser | null = await this.dao.findOneById(req.params.userId);
    if (!dbUser) {
      return notFound({ user: dbUser });
    }
    return okResponse(dbUser);
  };

  findOneByUsername = async (req: HttpRequest): Promise<HttpResponse> => {
    const dbUser: IUser | null = await this.dao.findOne({
      username: req.params.username,
    });

    if (!dbUser) {
      return notFound({ user: dbUser });
    }
    return okResponse(dbUser);
  };

  findAllByUsername = async (req: HttpRequest): Promise<HttpResponse> => {
    const username = req.params.username;
    const dbUsers: IUser[] = await this.dao.findAll({ username });
    return okResponse(dbUsers);
  };

  /**
   * Takes the details of a user from the client request and calls the dao to create a new user object using the request body. Sends back the new user, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  create = async (req: HttpRequest): Promise<HttpResponse> => {
    const dbUser = await this.dao.create(req.body);
    return okResponse(dbUser);
  };

  /**
   * Processes updating a user by calling the dao with the user id and update body from the request object. Sends the updated user object back to the client, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  update = async (req: HttpRequest): Promise<HttpResponse> => {
    const updatedUser = await this.dao.update(req.user.uid, req.body);
    return okResponse(updatedUser);
  };

  /**
   * Takes the user id from the request param and calls the dao to delete the user by id. Sends back the deleted user to the client once it is deleted and returned from the dao. Sends any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  delete = async (req: HttpRequest): Promise<HttpResponse> => {
    const deleteCount: boolean = await this.dao.delete(req.user.uid);
    return okResponse(deleteCount);
  };
}
