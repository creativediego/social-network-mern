import { urlConfig } from '../config/appConfig';
import { IPost } from '../interfaces/IPost';
import { APIServiceI, ReqType, apiService } from './APIService';

const BASE_URL = urlConfig.apiURL;
const USERS_API = `${BASE_URL}/users`;
const POSTS_API = `${BASE_URL}/posts`;

interface ILikeService {
  findAllPostsLikedByUser: (userId: string) => Promise<IPost[]>;
  findAllPostsDislikedByUser: (userId: string) => Promise<IPost[]>;
  findAllUsersThatLikedPost: (postId: string) => Promise<IPost[]>;
  userLikesPost: (postId: string) => Promise<IPost>;
  userDislikesPost: (postId: string) => Promise<IPost>;
}

class LikeServiceImpl implements ILikeService {
  private usersAPI: string;
  private postsAPI: string;
  private apiService: APIServiceI;

  private constructor(
    usersAPI: string,
    postsAPI: string,
    apiService: APIServiceI
  ) {
    this.usersAPI = usersAPI;
    this.postsAPI = postsAPI;
    this.apiService = apiService;
    Object.freeze(this);
  }

  public static getInstance(
    usersAPI: string,
    postsAPI: string,
    apiService: APIServiceI
  ) {
    return new LikeServiceImpl(usersAPI, postsAPI, apiService);
  }

  public findAllPostsLikedByUser = async (userId: string) => {
    return await this.apiService.makeRequest<IPost[]>(
      `${this.usersAPI}/${userId}/likes`,
      ReqType.GET,
      'Error getting posts. Try again later.'
    );
  };

  public findAllPostsDislikedByUser = async (userId: string) => {
    return await this.apiService.makeRequest<IPost[]>(
      `${this.usersAPI}/${userId}/dislikes`,
      ReqType.GET,
      'Error getting posts. Try again later.'
    );
  };

  public findAllUsersThatLikedPost = async (postId: string) => {
    return await this.apiService.makeRequest<IPost[]>(
      `${this.postsAPI}/${postId}/likes`,
      ReqType.GET,
      'Error getting posts. Try again later.'
    );
  };

  public userLikesPost = async (postId: string) => {
    return await this.apiService.makeRequest<IPost>(
      `${this.postsAPI}/${postId}/likes`,
      ReqType.POST,
      'Error liking post. Try again later.'
    );
  };

  public userDislikesPost = async (postId: string) => {
    return await this.apiService.makeRequest<IPost>(
      `${this.postsAPI}/${postId}/dislikes`,
      ReqType.POST,
      'Error disliking post. Try again later.'
    );
  };
}

const likeService = LikeServiceImpl.getInstance(
  USERS_API,
  POSTS_API,
  apiService
);
export { likeService, LikeServiceImpl };
// export const APIfindAllPostsLikedByUser = (userId: string) =>
//   callAPI<IPost[]>(
//     `${USERS_API}/${userId}/likes`,
//     Requests.GET,
//     'Error getting posts. Try again later.'
//   );

// export const APIfindAllPostsDislikedByUser = (userId: string) =>
//   callAPI<IPost[]>(
//     `${USERS_API}/${userId}/dislikes`,
//     Requests.GET,
//     'Error getting posts. Try again later.'
//   );

// export const APIfindAllUsersThatLikedPost = (tid: string) =>
//   callAPI<IPost[]>(
//     `${POSTS_API}/${tid}/likes`,
//     Requests.GET,
//     'Error getting posts. Try again later.'
//   );

// export const APIuserLikesPost = (postId: string) =>
//   callAPI<IPost>(
//     `${POSTS_API}/${postId}/likes`,
//     Requests.POST,
//     'Error liking post. Try again later.'
//   );

// export const APIuserDislikesPost = (postId: string) =>
//   callAPI<IPost>(
//     `${POSTS_API}/${postId}/dislikes`,
//     Requests.POST,
//     'Error disliking post. Try again later.'
//   );
