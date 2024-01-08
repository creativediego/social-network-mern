import dotenv from 'dotenv';
import IBaseDao from '../../daos/shared/IDao';
import IUser from '../../models/users/IUser';
import { Express, Router } from 'express';
import { okResponse } from '../shared/createResponse';
import HttpResponse from '../shared/HttpResponse';
import { adaptRequest } from '../shared/adaptRequest';
import HttpRequest from '../shared/HttpRequest';
import { IJWTService } from '../../services/IJWTService';
import { isAuthenticated } from './isAuthenticated';
dotenv.config();

/**
 * Handles authentication using json web tokens.
 */
export default class FirebaseAuthController {
  private readonly dao: IBaseDao<IUser>;
  private readonly firebaseJWTService: IJWTService;

  public constructor(
    path: string,
    app: Express,
    dao: IBaseDao<IUser>,
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
    // If req.user exists, then the user is already logged in with firebase and returned from db.
    if (req.user.id) {
      return okResponse(req.user);
    }
    // Otherwise, the user is logged in with firebase but not yet registered in db, so create the user in db.
    let dbUser = await this.dao.create(req.user);
    // Return user without password or other meta fields.
    dbUser = {
      id: dbUser.id,
      uid: dbUser.uid,
      name: dbUser.name,
      email: dbUser.email,
      username: dbUser.username,
      bio: dbUser.bio,
      profilePhoto: dbUser.profilePhoto,
      headerImage: dbUser.headerImage,
      registeredWithProvider: dbUser.registeredWithProvider,
    };

    return okResponse(dbUser);
  };
}
