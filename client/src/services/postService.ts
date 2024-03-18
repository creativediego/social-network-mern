import { IPost } from '../interfaces/IPost';
import { logToConsole } from '../util/logToConsole';
import { APIServiceI, ReqType, apiService } from './APIService';
import { urlConfig } from '../config/appConfig';
import { IQueryParams } from '../interfaces/IQueryParams';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export interface IPostService {
  findAllPosts: (queryParams: IQueryParams) => Promise<IPost[]>;
  findAllPostsByKeyword: (keyword: string) => Promise<IPost[]>;
  findAllPostsByUser: (
    userId: string,
    queryParams: IQueryParams
  ) => Promise<IPost[]>;
  createPost: (post: IPost) => Promise<IPost>;
  updatePost: (postId: string, post: IPost) => Promise<IPost>;
  deletePost: (postId: string) => Promise<IPost>;
  likePost: (postId: string) => Promise<IPost>;
  unlikePost: (postId: string) => Promise<IPost>;
  findAllPostsLikedByUser: (
    userId: string,
    queryParams: IQueryParams
  ) => Promise<IPost[]>;
  findAllPostsDislikedByUser: (userId: string) => Promise<IPost[]>;
}

class PostServiceImpl implements IPostService {
  private url: string;
  private APIService: APIServiceI;
  private static instance: PostServiceImpl;
  private constructor(url: string, apiService: APIServiceI) {
    this.url = url;
    this.APIService = apiService;
    Object.freeze(this);
  }

  public static getInstance(
    url: string,
    APIService: APIServiceI
  ): PostServiceImpl {
    if (!this.instance) {
      this.instance = new PostServiceImpl(url, APIService);
    }
    return this.instance;
  }

  public findAllPosts = async (queryParams: IQueryParams): Promise<IPost[]> => {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = queryParams;
    return await this.APIService.makeRequest<IPost[], number>(
      `${this.url}?page=${page}&limit=${limit}`,
      ReqType.GET,
      'Error finding posts. Try again later.'
    );
  };

  public findAllPostsByKeyword = async (keyword: string): Promise<IPost[]> => {
    const url = `${this.url}?keyword=${keyword}`;
    return await this.APIService.makeRequest<IPost[]>(
      url,
      ReqType.GET,
      'Error finding posts by keyword. Try again later.'
    );
  };

  public findAllPostsByUser = async (
    authorId: string,
    queryParams: IQueryParams
  ): Promise<IPost[]> => {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = queryParams;
    const url = `${this.url}?authorId=${authorId}&page=${page}&limit=${limit}`;
    return await this.APIService.makeRequest<IPost[]>(
      url,
      ReqType.GET,
      'Error finding posts by user. Try again later.'
    );
  };

  public createPost = async (post: IPost): Promise<IPost> => {
    const url = `${this.url}`;
    return await this.APIService.makeRequest<IPost, IPost>(
      url,
      ReqType.POST,
      'Error creating post. Try again later.',
      post
    );
  };

  public updatePost = async (postId: string, post: IPost): Promise<IPost> => {
    const url = `${this.url}/${postId}`;
    return await this.APIService.makeRequest<IPost, IPost>(
      url,
      ReqType.PUT,
      'Error updating post.',
      post
    );
  };

  public deletePost = async (postId: string): Promise<IPost> => {
    const url = `${this.url}/${postId}`;
    return await this.APIService.makeRequest<IPost>(
      url,
      ReqType.DELETE,
      'Error deleting post. Try again later.'
    );
  };

  public likePost = async (postId: string): Promise<IPost> => {
    const url = `${this.url}/likes/${postId}`;
    logToConsole('URL:', url);
    return await this.APIService.makeRequest<IPost>(
      url,
      ReqType.POST,
      'Error liking post. Try again later.'
    );
  };

  public unlikePost = async (postId: string): Promise<IPost> => {
    const url = `${this.url}/likes/${postId}`;
    return await this.APIService.makeRequest<IPost>(
      url,
      ReqType.DELETE,
      'Error disliking post. Try again later.'
    );
  };

  public findAllPostsLikedByUser = async (
    userId: string,
    queryParams: IQueryParams
  ): Promise<IPost[]> => {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = queryParams;
    const url = `${this.url}/likes/${userId}?page=${page}&limit=${limit}`;
    return await this.APIService.makeRequest<IPost[]>(
      url,
      ReqType.GET,
      'Error getting posts. Try again later.'
    );
  };

  public findAllPostsDislikedByUser = async (
    userId: string
  ): Promise<IPost[]> => {
    const url = `${this.url}/dislikes/${userId}`;
    return await this.APIService.makeRequest<IPost[]>(
      url,
      ReqType.GET,
      'Error getting posts. Try again later.'
    );
  };
}

const POST_API_URL = `${urlConfig.apiURL}/posts`;

export const postService = PostServiceImpl.getInstance(
  POST_API_URL,
  apiService
);
