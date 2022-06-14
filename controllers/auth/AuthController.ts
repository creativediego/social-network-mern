import dotenv from 'dotenv';
import IDao from '../../daos/shared/IDao';
import IUser from '../../models/users/IUser';
import { Express, Router } from 'express';
import UnauthorizedException from './UnauthorizedException';
import UserExistsException from './UserExistsException';
import IHasher from './IHasher';
import { validateRegistration } from '../middleware/validateUser';
import { validateResults } from '../middleware/validateResults';
import { isAuthenticated } from './isAuthenticated';
import { okResponse, unauthorizedResponse } from '../shared/createResponse';
import HttpResponse from '../shared/HttpResponse';
import { adaptRequest } from '../shared/adaptRequest';
import jwt from 'jsonwebtoken';
import HttpRequest from '../shared/HttpRequest';
import IAuthController from './IAuthController';
import IJWTService from '../../services/IJWTService';
dotenv.config();

/**
 * Handles authentication using json web tokens.
 */
export default class AuthController implements IAuthController {
  private readonly dao: IDao<IUser>;
  private readonly path: string;
  private readonly hasher: IHasher;
  private readonly jwtService: IJWTService;

  public constructor(
    app: Express,
    dao: IDao<IUser>,
    hasher: IHasher,
    jwtService: IJWTService
  ) {
    this.dao = dao;
    this.jwtService = jwtService;
    this.hasher = hasher;

    this.path = '/api/v1/auth';
    const router = Router();
    router.get('/profile', isAuthenticated, adaptRequest(this.getProfile));
    router.post('/login', adaptRequest(this.login));

    router.post(
      '/register',
      validateRegistration,
      validateResults,
      this.register
    );
    app.use(this.path, router);
    Object.freeze(this); // Make this object immutable.
  }

  login = async (req: HttpRequest): Promise<HttpResponse> => {
    let databaseUser: any = await this.dao.findByField(req.body.username);
    // const emailMatches = databaseUser.email === email;
    const passwordMatches = await this.hasher.compare(
      req.body.password,
      databaseUser.password
    );
    if (!passwordMatches)
      throw new UnauthorizedException(
        'Login error: Password or username/email does not match.'
      );

    const user = {
      id: databaseUser._id,
      username: databaseUser.username,
      name: databaseUser.name,
      email: databaseUser.name,
      profilePhoto: databaseUser.profilePhoto,
      headerImage: databaseUser.headerImage,
      bio: databaseUser.bio,
      birthday: databaseUser.birthday,
      followerCount: databaseUser.followerCount,
      followeeCount: databaseUser.followeeCount,
    };

    const token = await this.jwtService.signToken(user);

    return okResponse({ user, token });
  };

  getProfile = async (req: HttpRequest): Promise<HttpResponse> => {
    if (req.user) {
      const user: any = req.user;
      return okResponse(user);
    } else {
      return unauthorizedResponse('failed to get profile');
    }
  };

  register = async (req: HttpRequest): Promise<HttpResponse> => {
    const userExists: boolean = await this.dao.exists(req.body);
    if (userExists) {
      throw new UserExistsException('User Already Exists');
    }
    let user = req.body;
    user.password = await this.hasher.hash(req.body.password);
    const newUser: any = await this.dao.create(user);

    user = {
      id: newUser._id,
      username: newUser.username,
      name: newUser.name,
      profilePhoto: newUser.profilePhoto,
      followerCount: newUser.followerCount,
      followeeCount: newUser.followeeCount,
    };

    const token = this.jwtService.signToken(user);

    return okResponse({ user, token });
  };
}
