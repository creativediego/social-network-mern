import ITuitController from './ITuitController';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import { Express, Router } from 'express';
import { adaptRequest } from '../shared/adaptRequest';
import IDao from '../../daos/shared/IDao';
import ITuit from '../../models/tuits/ITuit';
import { isAuthenticated } from '../auth/isAuthenticated';
import { validateTuit } from '../middleware/validateTuit';
import { validateResults } from '../middleware/validateResults';
import AuthException from '../auth/AuthException';
import { okResponse } from '../shared/createResponse';
import ISocketService from '../../services/ISocketService';

/**
 * Handles CRUD requests and responses for the Tuit resource.  Implements {@link ITuitController}.
 */
export default class TuitController implements ITuitController {
  private readonly tuitDao: IDao<ITuit>;
  private readonly socketService: ISocketService;
  /**
   * Constructs the controller by calling the super abstract, setting the dao, and configuring the endpoint paths.
   * @param tuitDao a tuit dao that implements {@link ITuitDao}
   */
  public constructor(
    path: string,
    app: Express,
    dao: IDao<ITuit>,
    socketService: ISocketService
  ) {
    this.tuitDao = dao;
    this.socketService = socketService;
    const router: Router = Router();
    // router.use(isAuthenticated);
    router.get('/tuits', isAuthenticated, adaptRequest(this.findAll));
    router.get('/tuits/:tuitId', isAuthenticated, adaptRequest(this.findById));
    router.get(
      '/users/:userId/tuits',
      isAuthenticated,
      adaptRequest(this.findByUser)
    );
    router.post(
      '/users/:userId/tuits',
      isAuthenticated,
      validateTuit,
      validateResults,
      adaptRequest(this.create)
    );
    router.put('/tuits/:tuitId', isAuthenticated, adaptRequest(this.update));
    router.delete('/tuits/:tuitId', isAuthenticated, adaptRequest(this.delete));
    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }
  findByField(req: HttpRequest): Promise<HttpResponse> {
    throw new Error('Method not implemented.');
  }

  /**
   * Uses the user id from the request parameter to call the dao to find the user. Sends the found user back to the client, or passes any caught errors to the next error handler middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findByUser = async (req: HttpRequest): Promise<HttpResponse> => {
    if (req.params.userId === 'me') {
      return { body: await this.tuitDao.findByField(req.user.id) };
    }

    return { body: await this.tuitDao.findByField(req.params.userId) };
  };

  /**
   * Calls the dao to find all tuits and returns them in the response. Passes errors to the next middleware.
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAll = async (): Promise<HttpResponse> => {
    return { body: await this.tuitDao.findAll() };
  };

  /**
   * Takes the tuitId from the request params and calls the dao to find the tuit. Sends the tuit back to the client, or passes any errors to the next middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findById = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: await this.tuitDao.findById(req.params.tuitId) };
  };

  /**
   * Takes the details of a tuit from the client request and calls the dao to create a new tuit object using the request body. Sends back the new tuit, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  create = async (req: HttpRequest): Promise<HttpResponse> => {
    const tuit = await this.tuitDao.create({
      tuit: req.body.tuit,
      author: req.user.id,
    });
    this.socketService.emitToAll('NEW_TUIT', tuit);
    return okResponse(tuit);
  };

  /**
   * Processes updating a tuit by calling the dao with the tuit id and update body from the request object. Sends the updated tuit object back to the client, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  update = async (req: HttpRequest): Promise<HttpResponse> => {
    const tuit: any = {
      id: req.body.id,
      tuit: req.body.tuit,
    };
    return {
      body: await this.tuitDao.update(req.params.tuitId, tuit),
    };
  };

  /**
   * Takes the tuit id from the request param and calls the dao to delete the tuit by id. Sends back the deleted tuit to the client once it is deleted and returned from the dao. Sends any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  delete = async (req: HttpRequest): Promise<HttpResponse> => {
    const tuit: any = await this.tuitDao.findById(req.params.tuitId);
    if (req.user.id !== tuit.author.id) {
      throw new AuthException('User not authorized to delete tuit.');
    }
    const deletedCount = this.tuitDao.delete(req.params.tuitId);
    return okResponse(deletedCount);
  };
}
