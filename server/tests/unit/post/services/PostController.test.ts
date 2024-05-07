import { IHttpRequest } from '../../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../../common/interfaces/IHttpResponse';
import { mockLogger } from '../../../mocks/mockLogger';
import { IPost } from '../../../../features/post/models/IPost';
import { mockPosts } from '../../../mocks/mockPosts';
import { IPostController } from '../../../../features/post/controllers/IPostController';
import { IPostService } from '../../../../features/post/services/IPostService';
import { PostController } from '../../../../features/post/controllers/PostController';
import { mockUsers } from '../../../mocks/mockUsers';
import { IUser } from '../../../../features/user/models/IUser';

let mockRequest: IHttpRequest;
const mockPost: IPost = mockPosts[0];
const mockUser: IUser = mockUsers[0];

const postService: IPostService = {
  findAllPostsByKeyword: jest.fn(),
  findAllPostsByAuthorId: jest.fn(),
  findAll: jest.fn().mockResolvedValue(mockPosts),
  findById: jest.fn().mockResolvedValue(mockPosts[0]),
  create: jest.fn().mockResolvedValue(mockPosts[0]),
  update: jest.fn(),
  delete: jest.fn(),
};
const mockPostService = postService as jest.Mocked<IPostService>;

describe('Post Controller', () => {
  let postController: IPostController;

  beforeEach(() => {
    postController = new PostController(mockPostService, mockLogger);

    mockRequest = {
      method: '',
      url: '',
      path: '',
      headers: {},
      params: {},
      body: {},
      query: {
        page: 1,
        limit: 10,
        authorId: mockUser.id,
      },
      responseType: 'text',
      user: {},
    };
  });

  describe('create', () => {
    it('should create a post.', async () => {
      mockRequest.body = mockPost;
      const response: IHttpResponse<IPost> = await postController.create(
        mockRequest
      );
      expect(mockPostService.create).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalled();
      expect(response.body).toBe(mockPost);
    });
  });

  describe('findAllPostsByUser', () => {
    it('should find all posts by user with appropriate page/limit.', async () => {
      mockPostService.findAllPostsByAuthorId.mockResolvedValue(mockPosts);
      const { authorId, page, limit } = mockRequest.query;
      const response: IHttpResponse<IPost[]> =
        await postController.findAllPostsByAuthorId(mockRequest);

      expect(mockPostService.findAllPostsByAuthorId).toHaveBeenCalledWith(
        authorId,
        page,
        limit
      );
    });
  });
});
