import { IBaseController } from '../../../common/interfaces/IBaseController';
import { IBaseDao } from '../../../common/interfaces/IBaseDao';
import { IUser } from '../models/IUser';
import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import {
  noContentResponse,
  okResponse,
} from '../../../common/util/httpResponses';
import { ILogger } from '../../../common/logger/ILogger';
import { IUserDao } from '../daos/IUserDao';
import { ControllerError } from '../../../common/errors/ControllerError';
import { IUserController } from './IUserController';

/**
 * Processes the requests and responses dealing with the user resource. Implements {@link IBaseController}.
 */
export class UserController implements IUserController {
  private readonly dao: IUserDao;
  private readonly logger: ILogger;

  /**
   * Constructs the user controller by calling the super abstract, setting the dao, and configuring the endpoint paths.
   * @param dao a user dao that implements {@link IBaseDao}
   */

  public constructor(dao: IUserDao, logger: ILogger) {
    this.dao = dao;
    this.logger = logger;

    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Calls the dao to find all users and returns them in the response. Passes errors to the next middleware.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  findAll = async (req: IHttpRequest): Promise<IHttpResponse<IUser[]>> => {
    const allUsers: IUser[] = await this.dao.findAllUsersByKeyword(
      req.params.keyword
    );
    return okResponse(allUsers);
  };

  /**
   * Takes the user id from the request params and calls the dao to find the user. Sends the user back to the client, or passes any errors to the next middleware.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  findById = async (req: IHttpRequest): Promise<IHttpResponse<IUser>> => {
    const dbUser: IUser | null = await this.dao.findById(req.params.userId);
    if (!dbUser) {
      throw new ControllerError(`User ${req.params.userId} not found.`, 404);
    }
    return okResponse(dbUser);
  };

  findOne = async (req: IHttpRequest): Promise<IHttpResponse<IUser>> => {
    const username = req.params.username;
    const dbUser: IUser | null = await this.dao.findOne({ username });
    if (!dbUser) {
      throw new ControllerError(`User ${req.params.username} not found.`, 404);
    }
    return okResponse(dbUser);
  };

  findAllByUsername = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IUser[]>> => {
    const username = req.params.username;
    const dbUsers: IUser[] = await this.dao.findAllUsersByKeyword(username);
    return okResponse(dbUsers);
  };

  /**
   * Takes the details of a user from the client request and calls the dao to create a new user object using the request body. Sends back the new user, or passes any errors to the next function middleware.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  create = async (req: IHttpRequest): Promise<IHttpResponse<IUser>> => {
    const dbUser = await this.dao.create(req.body);
    const logUser: Partial<IUser> = {
      name: dbUser.name,
      username: dbUser.username,
      uid: dbUser.uid,
      accountType: dbUser.accountType,
    };
    this.logger.info(`Created user ${logUser}`);
    return okResponse(dbUser);
  };

  /**
   * Processes updating a user by calling the dao with the user id and update body from the request object. Sends the updated user object back to the client, or passes any errors to the next function middleware.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  update = async (req: IHttpRequest): Promise<IHttpResponse<IUser>> => {
    const user = req.body;
    const updatedUser = await this.dao.update(user.id, user);
    this.logger.info(`Updated user ${updatedUser}`);
    return okResponse(updatedUser);
  };

  /**
   * Takes the user id from the request param and calls the dao to delete the user by id. Sends back the deleted user to the client once it is deleted and returned from the dao. Sends any errors to the next function middleware.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  delete = async (req: IHttpRequest): Promise<IHttpResponse<void>> => {
    const deleteCount: boolean = await this.dao.delete(req.user.uid);
    this.logger.info(`Deleted user ${req.user.uid}`);
    return noContentResponse();
  };
}
