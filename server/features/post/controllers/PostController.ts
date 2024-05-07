import { IPostController } from './IPostController';
import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import { IPost } from '../models/IPost';

import {
  noContentResponse,
  okResponse,
} from '../../../common/util/httpResponses';
import { IPostService } from '../services/IPostService';
import { ILogger } from '../../../common/logger/ILogger';
import { ControllerError } from '../../../common/errors/ControllerError';
import { FilterOptions } from '../../../common/interfaces/IBaseDao';
/**
 * Handles CRUD requests and responses for the Post resource.  Implements {@link IPostController}.
 */
export class PostController implements IPostController {
  private readonly postService: IPostService;
  private readonly logger: ILogger;
  /**
   * Constructs the controller by calling the super abstract, setting the dao, and configuring the endpoint paths.
   * @param postDao a post dao that implements {@link IPostDao}
   */
  public constructor(postService: IPostService, logger: ILogger) {
    this.postService = postService;
    this.logger = logger;
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Uses the user id from the request parameter to call the dao to find the user. Sends the found user back to the client, or passes any caught errors to the next error handler middleware.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  public findAllPostsByAuthorId = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IPost[]>> => {
    console.log('called');
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const filter: FilterOptions<IPost> = {
      page,
      limit,
    };
    const authorId = req.query.authorId;
    if (!authorId) {
      throw new ControllerError(`Missing query parameter: authorId`, 400);
    }
    const posts: IPost[] = await this.postService.findAllPostsByAuthorId(
      authorId,
      filter
    );
    this.logger.info(
      `User ${req.user.username} requested ${posts.length} posts for user ${authorId}.`
    );
    return okResponse(posts);
  };

  public findAllPostsByKeyword = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IPost[]>> => {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const filter: FilterOptions<IPost> = {
      page,
      limit,
      order: 'desc',
    };
    const posts: IPost[] = await this.postService.findAllPostsByKeyword(
      req.params.keyword,
      filter
    );
    this.logger.info(
      `User ${req.user.username} requested ${posts.length} posts for keyword ${req.params.hashtag}.`
    );
    return okResponse(posts);
  };

  /**
   * Calls the dao to find all posts and returns them in the response. Passes errors to the next middleware.
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  public findAll = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IPost[]>> => {
    const hashtag = req.query.hashtag;
    const authorId = req.query.authorId;
    if (hashtag) {
      return this.findAllPostsByKeyword(req);
    } else if (authorId) {
      return this.findAllPostsByAuthorId(req);
    }

    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const filter: FilterOptions<IPost> = {
      page,
      limit,
      order: 'desc',
    };
    const posts: IPost[] = await this.postService.findAll(filter);
    this.logger.info(
      `User ${req.user.username} requested ${posts.length} posts for page ${page} and limit ${limit}.`
    );
    return okResponse(posts);
  };

  /**
   * Takes the postId from the request params and calls the dao to find the post. Sends the post back to the client, or passes any errors to the next middleware.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  public findById = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IPost>> => {
    const post: IPost | null = await this.postService.findById(
      req.params.postId
    );
    if (!post) {
      throw new ControllerError(`Post ${req.params.postId} not found.`, 404);
    }
    this.logger.info(
      `User ${req.user.username} requested post by id ${req.params.postId}:\n ${post}.`
    );
    return okResponse(post);
  };

  /**
   * Takes the details of a post from the client request and calls the dao to create a new post object using the request body. Sends back the new post, or passes any errors to the next function middleware.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  public create = async (req: IHttpRequest): Promise<IHttpResponse<IPost>> => {
    const post = await this.postService.create(req.body);
    this.logger.info(`User ${req.user.username} created post ${post}.`);
    return okResponse(post);
  };

  /**
   * Processes updating a post by calling the dao with the post id and update body from the request object. Sends the updated post object back to the client, or passes any errors to the next function middleware.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  public update = async (req: IHttpRequest): Promise<IHttpResponse<IPost>> => {
    let post: any = {
      ...req.body,
    };
    const updatePost = await this.postService.update(req.params.postId, post);
    this.logger.info(`User ${req.user.username} updated post ${updatePost}.`);
    return okResponse(updatePost);
  };

  /**
   * Takes the post id from the request param and calls the dao to delete the post by id. Sends back the deleted post to the client once it is deleted and returned from the dao. Sends any errors to the next function middleware.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  public delete = async (req: IHttpRequest): Promise<IHttpResponse<void>> => {
    await this.postService.delete(req.params.postId);
    this.logger.info(
      `User ${req.user.username} deleted post ${req.params.postId}`
    );
    return noContentResponse();
  };
}
