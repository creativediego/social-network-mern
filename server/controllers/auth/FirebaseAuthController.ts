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
    // router.post('/login', isAuthenticated, adaptRequest(this.login));
    // router.post('/register', adaptRequest(this.register));
    router.get('/profile', isAuthenticated, adaptRequest(this.getProfile));

    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }

  getProfile = async (req: HttpRequest): Promise<HttpResponse> => {
    const firebaseUser: DecodedIdToken = req.user;
    // Verify the user's firebase token
    // If firebase user is null or email is null, return unauthorized
    if (!firebaseUser || !firebaseUser.email) {
      return unauthorizedResponse('Cannot retrieve user from token.');
    }
    const user: IUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
    };
    // Check if the user exists in the database
    const exists = await this.dao.exists(user);
    if (exists) {
      const existingUser = await this.dao.findById(firebaseUser.uid);
      return okResponse(existingUser);
    }

    const newUser = await this.dao.create(user);
    return okResponse(newUser);
  };

  // register = async (req: HttpRequest): Promise<HttpResponse> => {
  //   const firebaseUser = await this.firebaseJWTService.verifyToken(
  //     req.body.token
  //   );
  //   const userExists: boolean = await this.dao.exists(req.body);
  //   if (userExists) {
  //     throw new UserExistsException('User Already Exists');
  //   }

  //   const user: any = await this.dao.create(firebaseUser);
  //   return okResponse(user);
  // };

  // getProfile = async (req: HttpRequest): Promise<HttpResponse> => {
  //   let user = await this.dao.findByField(req.user.email);
  //   return okResponse(user);
  // };
}
function notFoundResponse(
  arg0: string
): HttpResponse | PromiseLike<HttpResponse> {
  throw new Error('Function not implemented.');
}
