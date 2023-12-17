import dotenv from 'dotenv';
import IDao from '../../daos/shared/IDao';
import IUser from '../../models/users/IUser';
import { Express, Router } from 'express';
import UserExistsException from './UserExistsException';
import { okResponse, unauthorizedResponse } from '../shared/createResponse';
import HttpResponse from '../shared/HttpResponse';
import { adaptRequest } from '../shared/adaptRequest';
import HttpRequest from '../shared/HttpRequest';
import IAuthController from './IAuthController';
import { IJWTService } from '../../services/IJWTService';
import { isAuthenticated } from './isAuthenticated';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
dotenv.config();

/**
 * Handles authentication using json web tokens.
 */
export default class FirebaseAuthController {
  private readonly dao: IDao<IUser>;
  private readonly firebaseJWTService: IJWTService;

  public constructor(
    path: string,
    app: Express,
    dao: IDao<IUser>,
    jwtService: IJWTService
  ) {
    this.dao = dao;
    this.firebaseJWTService = jwtService;
    const router = Router();
    router.get('/profile', isAuthenticated, adaptRequest(this.getProfile));
    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }

  getProfile = async (req: HttpRequest): Promise<HttpResponse> => {
    const user = req.user; // from firebase auth middleware on this route.
    // Upsert the user in the database in case they don't exist.
    const newUser = await this.dao.create(user);
    return okResponse(newUser);
  };
}
