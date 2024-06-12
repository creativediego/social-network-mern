import { IUser } from '../interfaces/IUser';
import { urlConfig } from '../config/appConfig';
import { firebaseLogout } from '../firebase/firebaseAuthService';
import { APIServiceI, ReqType, apiService } from './APIService';

/**
 * Interface for the Authentication API.
 */
export interface IAuthService<T> {
  register: (user: Partial<T>) => Promise<T>;
  logout: () => Promise<void>;
  getProfile: () => Promise<T>;
}

/**
 * Interacts with the Authentication API. It contains methods that register a user, log out a user, and get a user's profile.
 */
class AuthServiceImpl implements IAuthService<IUser> {
  private static instance: AuthServiceImpl;
  private readonly url: string;
  private readonly apiService: APIServiceI;

  private constructor(authURL: string, apiService: APIServiceI) {
    this.url = authURL;
    this.apiService = apiService;
    Object.freeze(this);
  }

  public static getInstance(
    authURL: string,
    apiService: APIServiceI
  ): AuthServiceImpl {
    if (!this.instance) {
      this.instance = new AuthServiceImpl(authURL, apiService);
    }
    return this.instance;
  }

  public register = async (user: Partial<IUser>): Promise<IUser> => {
    return await this.apiService.makeRequest<IUser, Partial<IUser>>(
      `${this.url}/register`,
      ReqType.POST,
      `Error registering. Try again later`,
      user
    );
  };

  public logout = async () => {
    await firebaseLogout();
  };

  public getProfile = async () =>
    await this.apiService.makeRequest<IUser>(`${this.url}/login`, ReqType.GET);
}

const SECURITY_API = urlConfig.authApi;
const authService = AuthServiceImpl.getInstance(SECURITY_API, apiService);
export { AuthServiceImpl, authService };
