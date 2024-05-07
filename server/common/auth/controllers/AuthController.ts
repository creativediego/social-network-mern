import { IUser } from '../../../features/user/models/IUser';
import { IHttpResponse } from '../../interfaces/IHttpResponse';
import { IHttpRequest } from '../../interfaces/IHttpRequest';
import IAuthController from './IAuthController';
import { okResponse } from '../../util/httpResponses';
import { IUserDao } from '../../../features/user/daos/IUserDao';
import { ILogger } from '../../logger/ILogger';

/**
 * Provides endpoints for user login and registration. It uses Firebase authentication middleware to authenticate users and the data access object (DAO) to create or return new users in the database.
 */
export class AuthController implements IAuthController {
  private readonly dao: IUserDao;
  private readonly logger: ILogger;

  /**
   * Creates an instance of the FirebaseAuthController.

   * @param dao - An instance of the data access object (DAO) for user-related operations.
   */
  public constructor(dao: IUserDao, logger: ILogger) {
    this.dao = dao;
    this.logger = logger;

    // Makes the current instance of the controller immutable.
    Object.freeze(this);
  }

  /**
   * Handles user login. If the user is already authenticated,
   * it returns the user's information; otherwise, it registers the user.
   * @param req - The HTTP request object containing user information.
   * @returns A promise that resolves to an HTTP response with user information.
   */
  login = async (req: IHttpRequest): Promise<IHttpResponse<IUser>> => {
    if (!req.user.id) {
      const newUser = await this.dao.create(req.user);
      return okResponse(newUser);
    }
    this.logger.info(`Login: username: ${req.user.uid}.`);
    return okResponse(req.user);
  };

  /**
   * Handles user registration by creating a new user in the database.
   * Returns a response with the registered user's information.
   * @param req - The HTTP request object containing user information.
   * @returns A promise that resolves to an HTTP response with the registered user's information.
   */
  register = async (req: IHttpRequest): Promise<IHttpResponse<IUser>> => {
    let dbUser: IUser = await this.dao.create(req.body);
    this.logger.info(`New user created: ${dbUser}`); // no sensitive data so logging entire user object
    return okResponse(dbUser);
  };
}
