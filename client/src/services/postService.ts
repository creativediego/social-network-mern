import { IPost } from '../interfaces/IPost';
import { logToConsole } from '../util/logToConsole';
import { APIServiceI, Requests, APIService } from './APIService';
import { configENV } from '../config/appConfig';

export interface IPostService {
  findAllPosts: () => Promise<IPost[]>;
  findAllPostsByKeyword: (keyword: string) => Promise<IPost[]>;
  findAllPostsByUser: (userId: string) => Promise<IPost[]>;
  createPost: (userId: string, post: IPost) => Promise<IPost>;
  updatePost: (postId: string, post: IPost) => Promise<IPost>;
  deletePost: (postId: string) => Promise<IPost>;
  likePost: (postId: string) => Promise<IPost>;
  dislikePost: (postId: string) => Promise<IPost>;
  findAllPostsLikedByUser: (userId: string) => Promise<IPost[]>;
  findAllPostsDislikedByUser: (userId: string) => Promise<IPost[]>;
}

class PostServiceImpl implements IPostService {
  private url: string;
  private APIService: APIServiceI;

  private constructor(url: string, apiService: APIServiceI) {
    this.url = url;
    this.APIService = apiService;
    Object.freeze(this);
  }

  public static getInstance(
    url: string,
    APIService: APIServiceI
  ): PostServiceImpl {
    return new PostServiceImpl(url, APIService);
  }

  public findAllPosts = async (): Promise<IPost[]> => {
    return await this.APIService.makeRequest<IPost[]>(
      this.url,
      Requests.GET,
      'Error finding posts. Try again later.'
    );
  };

  public findAllPostsByKeyword = async (keyword: string): Promise<IPost[]> => {
    const url = `${this.url}/search/${keyword}`;
    return await this.APIService.makeRequest<IPost[]>(
      url,
      Requests.GET,
      'Error finding posts by keyword. Try again later.'
    );
  };

  public findAllPostsByUser = async (userId: string): Promise<IPost[]> => {
    const url = `${this.url}/${userId}/posts`;
    return await this.APIService.makeRequest<IPost[]>(
      url,
      Requests.GET,
      'Error finding posts by user. Try again later.'
    );
  };

  public createPost = async (userId: string, post: IPost): Promise<IPost> => {
    const url = `${this.url}/${userId}/posts`;
    return await this.APIService.makeRequest<IPost, IPost>(
      url,
      Requests.POST,
      'Error creating post. Try again later.',
      post
    );
  };

  public updatePost = async (postId: string, post: IPost): Promise<IPost> => {
    const url = `${this.url}/${postId}`;
    return await this.APIService.makeRequest<IPost, IPost>(
      url,
      Requests.PUT,
      'Error updating post.',
      post
    );
  };

  public deletePost = async (postId: string): Promise<IPost> => {
    const url = `${this.url}/${postId}`;
    return await this.APIService.makeRequest<IPost>(
      url,
      Requests.DELETE,
      'Error deleting post. Try again later.'
    );
  };

  public likePost = async (postId: string): Promise<IPost> => {
    const url = `${this.url}/${postId}/likes`;
    logToConsole('URL:', url);
    return await this.APIService.makeRequest<IPost>(
      url,
      Requests.POST,
      'Error liking post. Try again later.'
    );
  };

  public dislikePost = async (postId: string): Promise<IPost> => {
    const url = `${this.url}/${postId}/dislikes`;
    return await this.APIService.makeRequest<IPost>(
      url,
      Requests.POST,
      'Error disliking post. Try again later.'
    );
  };

  public findAllPostsLikedByUser = async (userId: string): Promise<IPost[]> => {
    const url = `${this.url}/${userId}/likes`;
    return await this.APIService.makeRequest<IPost[]>(
      url,
      Requests.GET,
      'Error getting posts. Try again later.'
    );
  };

  public findAllPostsDislikedByUser = async (
    userId: string
  ): Promise<IPost[]> => {
    const url = `${this.url}/${userId}/dislikes`;
    return await this.APIService.makeRequest<IPost[]>(
      url,
      Requests.GET,
      'Error getting posts. Try again later.'
    );
  };
}

const POST_API_URL = `${configENV.apiURL}/posts`;

export const postService = PostServiceImpl.getInstance(
  POST_API_URL,
  APIService
);
