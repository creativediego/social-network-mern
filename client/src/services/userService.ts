import { IUser } from '../interfaces/IUser';
import { urlConfig } from '../config/appConfig';
import { APIServiceI, ReqType, apiService } from './APIService';

export interface IUserService<IUser> {
  createUser: (user: IUser) => Promise<IUser>;
  findUserByUsername: (username: string) => Promise<IUser>;
  updateUser: (user: IUser) => Promise<IUser>;
  findAllUsers: () => Promise<IUser[]>;
  findUserById: (uid: string) => Promise<IUser>;
  deleteUser: (uid: number) => Promise<IUser>;
  followUser: (uid: string, followeeId: string) => Promise<IUser>;
  deleteFollow: (uid: string, followeeId: string) => Promise<IUser>;
  findFollow: (uid: string, followeeId: string) => Promise<boolean>;
}

class UserServiceImpl implements IUserService<IUser> {
  private static instance: UserServiceImpl;
  private readonly apiURL: string;
  private readonly apiService: APIServiceI;

  private constructor(apiURL: string, apiService: APIServiceI) {
    this.apiURL = apiURL;
    this.apiService = apiService;
    Object.freeze(this);
  }

  public static getInstance(
    apiURL: string,
    apiService: APIServiceI
  ): UserServiceImpl {
    if (!this.instance) {
      this.instance = new UserServiceImpl(apiURL, apiService);
    }
    return this.instance;
  }

  public createUser = async (user: IUser): Promise<IUser> => {
    return await this.apiService.makeRequest<IUser, IUser>(
      `${this.apiURL}`,
      ReqType.POST,
      'Error creating user. Try again later.',
      user
    );
  };

  public findUserByUsername = async (username: string): Promise<IUser> => {
    return await this.apiService.makeRequest<IUser>(
      `${this.apiURL}/${username}`,
      ReqType.GET,
      'Error finding user. Try again later.'
    );
  };

  public updateUser = async (user: IUser): Promise<IUser> => {
    return await this.apiService.makeRequest<IUser, IUser>(
      `${this.apiURL}/${user.id}`,
      ReqType.PUT,
      'Error updating user. Try again later.',
      user
    );
  };

  public findAllUsers = async (): Promise<IUser[]> => {
    return await this.apiService.makeRequest<IUser[]>(
      `${this.apiURL}`,
      ReqType.GET,
      'Error finding users.'
    );
  };

  public findUserById = async (id: string): Promise<IUser> => {
    return await this.apiService.makeRequest<IUser>(
      `${this.apiURL}/${id}`,
      ReqType.GET,
      'Error finding user.'
    );
  };

  public deleteUser = async (id: number): Promise<IUser> => {
    return await this.apiService.makeRequest<IUser>(
      `${this.apiURL}/${id}`,
      ReqType.DELETE,
      'Error deleting user.'
    );
  };

  public followUser = async (
    followerId: string,
    followeeId: string
  ): Promise<IUser> => {
    return await this.apiService.makeRequest<
      IUser,
      { followerId: string; followeeId: string }
    >(`${this.apiURL}/follows`, ReqType.POST, 'Error following user.', {
      followerId,
      followeeId,
    });
  };

  public deleteFollow = async (
    followerId: string,
    followeeId: string
  ): Promise<IUser> => {
    return await this.apiService.makeRequest<
      IUser,
      { followerId: string; followeeId: string }
    >(`${this.apiURL}/follows`, ReqType.DELETE, 'Error unfollowing user.', {
      followerId,
      followeeId,
    });
  };

  public findFollow = async (
    followerId: string,
    followeeId: string
  ): Promise<boolean> => {
    const followers = await this.apiService.makeRequest<
      IUser[],
      { followerId: string; followeeId: string }
    >(`${this.apiURL}/follows`, ReqType.GET, 'Error checking if followed.', {
      followerId,
      followeeId,
    });
    return followers.some((follower) => follower.id === followeeId);
  };
}

const USERS_API = `${urlConfig.apiURL}/users`;
const userService = UserServiceImpl.getInstance(USERS_API, apiService);

export { UserServiceImpl, userService };
