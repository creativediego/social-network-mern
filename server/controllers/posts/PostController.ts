import IPostController from './IPostController';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import { Express, Router } from 'express';
import { adaptRequest } from '../shared/adaptRequest';
import IBaseDao from '../../daos/shared/IDao';
import IPost from '../../models/posts/IPost';
import { isAuthenticated } from '../auth/isAuthenticated';
import { validatePost } from '../middleware/validatePost';
import { validateResults } from '../middleware/validateResults';
import AuthException from '../auth/AuthException';
import { okResponse } from '../shared/createResponse';
import { ISocketService } from '../../services/ISocketService';
import DaoDatabaseException from '../../errors/DaoDatabseException';

/**
 * Handles CRUD requests and responses for the Post resource.  Implements {@link IPostController}.
 */
export default class PostController implements IPostController {
  private readonly postDao: IBaseDao<IPost>;
  private readonly socketService: ISocketService;
  /**
   * Constructs the controller by calling the super abstract, setting the dao, and configuring the endpoint paths.
   * @param postDao a post dao that implements {@link IPostDao}
   */
  public constructor(
    path: string,
    app: Express,
    dao: IBaseDao<IPost>,
    socketService: ISocketService
  ) {
    this.postDao = dao;
    this.socketService = socketService;
    const router: Router = Router();
    // router.use(isAuthenticated);
    router.get('/posts', isAuthenticated, adaptRequest(this.findAll));
    router.get(
      '/posts/search/:keyword',
      isAuthenticated,
      adaptRequest(this.findOneByUsername)
    );
    router.get('/posts/:postId', isAuthenticated, adaptRequest(this.findById));
    router.get(
      '/users/:userId/posts',
      isAuthenticated,
      adaptRequest(this.findByUser)
    );
    router.post(
      '/users/:userId/posts',
      isAuthenticated,
      validatePost,
      validateResults,
      adaptRequest(this.create)
    );
    router.put('/posts/:postId', isAuthenticated, adaptRequest(this.update));
    router.delete('/posts/:postId', isAuthenticated, adaptRequest(this.delete));
    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }
  findAllByKeyword(req: HttpRequest): Promise<HttpResponse> {
    throw new Error('Method not implemented.');
  }

  findOneByUsername = async (req: HttpRequest): Promise<HttpResponse> => {
    const posts: IPost[] = await this.postDao.findAllByField(
      req.params.keyword
    );
    return okResponse(posts);
  };

  /**
   * Uses the user id from the request parameter to call the dao to find the user. Sends the found user back to the client, or passes any caught errors to the next error handler middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findByUser = async (req: HttpRequest): Promise<HttpResponse> => {
    const posts: IPost[] = await this.postDao.findByField(req.params.userId);
    return okResponse(posts);
  };

  /**
   * Calls the dao to find all posts and returns them in the response. Passes errors to the next middleware.
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAll = async (): Promise<HttpResponse> => {
    const posts: IPost[] = await this.postDao.findAll();
    return okResponse(posts);
  };

  /**
   * Takes the postId from the request params and calls the dao to find the post. Sends the post back to the client, or passes any errors to the next middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findById = async (req: HttpRequest): Promise<HttpResponse> => {
    const post: IPost = await this.postDao.findOneById(req.params.postId);
    return okResponse(post);
  };

  /**
   * Takes the details of a post from the client request and calls the dao to create a new post object using the request body. Sends back the new post, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  create = async (req: HttpRequest): Promise<HttpResponse> => {
    const post = await this.postDao.create({
      ...req.body,
      author: {
        id: req.user.id,
      },
    });

    this.socketService.emitToAll('NEW_POST', post);
    return okResponse(post);
  };

  /**
   * Processes updating a post by calling the dao with the post id and update body from the request object. Sends the updated post object back to the client, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  update = async (req: HttpRequest): Promise<HttpResponse> => {
    let post: any = {
      ...req.body,
    };
    delete post.author;

    const updatePost = await this.postDao.update(req.params.postId, post);
    this.socketService.emitToAll('UPDATED_POST', post);
    return okResponse(updatePost);
  };

  /**
   * Takes the post id from the request param and calls the dao to delete the post by id. Sends back the deleted post to the client once it is deleted and returned from the dao. Sends any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  delete = async (req: HttpRequest): Promise<HttpResponse> => {
    const post: IPost = await this.postDao.findOneById(req.params.postId);
    if (req.user.id !== post.author.id) {
      throw new AuthException('User not authorized to delete post.');
    }
    const deletedPost: IPost = await this.postDao.delete(req.params.postId);
    this.socketService.emitToAll('DELETED_POST', post);
    return okResponse(deletedPost);
  };
}
