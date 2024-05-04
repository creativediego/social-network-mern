import { urlConfig } from '../config/appConfig';
import IFollow from '../interfaces/IFollow';
import { IUser } from '../interfaces/IUser';
import { APIServiceI, ReqType, apiService } from './APIService';

const FOLLOW_API = `${urlConfig.apiURL}/users`;

interface IFollowService {
  followUser: (userId: string) => Promise<number>;
  unfollowUser: (followeeId: string) => Promise<number>;
  findAllFollowers: (userId: string) => Promise<IUser[]>;
  isFollowed: (followerId: string, followeeId: string) => Promise<boolean>;
}

class FollowServiceImpl implements IFollowService {
  private usersAPI: string;
  private apiService: APIServiceI;

  private constructor(usersAPI: string, apiService: APIServiceI) {
    this.usersAPI = usersAPI;
    this.apiService = apiService;
    Object.freeze(this);
  }

  public static getInstance(usersAPI: string, apiService: APIServiceI) {
    return new FollowServiceImpl(usersAPI, apiService);
  }

  public followUser = async (userId: string) => {
    return await this.apiService.makeRequest<number>(
      `${FOLLOW_API}/${userId}/follow`,
      ReqType.POST,
      'Error following user. Try again later.'
    );
  };

  public unfollowUser = async (userId: string) => {
    const url = `${FOLLOW_API}/${userId}/unfollow`;
    return await this.apiService.makeRequest<number>(
      url,
      ReqType.DELETE,
      'Error unfollowing user. Try again later.'
    );
  };

  public isFollowed = async (userId: string) => {
    return await this.apiService.makeRequest<boolean>(
      `${FOLLOW_API}/${userId}/follow`,
      ReqType.GET,
      'Error checking follow.'
    );
  };

  public findAllFollowers = async (userId: string) => {
    const url = `${this.usersAPI}/${userId}/followers`;
    return await this.apiService.makeRequest<IUser[]>(url, ReqType.GET);
  };
}

const followService = FollowServiceImpl.getInstance(FOLLOW_API, apiService);
export { followService, FollowServiceImpl };

// // Create a Follows object encompassing the relationship between the given users
// export const APIfollowUser = (userId: string, followeeId: string) =>
//   callAPI<IFollow, { followeeId: string }>(
//     `${USERS_API}/${userId}/follows`,
//     Requests.POST,
//     'Error following user. Try again later.',
//     {
//       followeeId,
//     }
//   );

// // Delete the Follows object encompassing the relationship between the given users
// export const APIunfollowUser = async (uid: string, followeeId: string) =>
//   callAPI<IFollow, { data: string }>(
//     `${USERS_API}/${uid}/follows`,
//     Requests.DELETE,
//     'Error unfollowing user. Try again later.',
//     {
//       data: followeeId,
//     }
//   );

// // Find all followers for the given user id
// export const APIfindAllFollowers = (uid: string) =>
//   callAPI<IUser[]>(`${USERS_API}/${uid}/followers`, Requests.GET);
