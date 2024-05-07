import { IHttpRequest } from '../../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../../common/interfaces/IHttpResponse';
import { mockUsers } from '../../../mocks/mockUsers';
import { IUser } from '../../../../features/user/models/IUser';
import { AuthController } from '../../../../common/auth/controllers/AuthController';
import { mockLogger } from '../../../mocks/mockLogger';
import IAuthController from '../../../../common/auth/controllers/IAuthController';
import { IUserDao } from '../../../../features/user/daos/IUserDao';

let mockRegisteredUser: IUser;
let mockNonRegisteredUser: IUser;
let mockRequest: IHttpRequest;
const mockUser = mockUsers[0];

const userDao: IUserDao = {
  findById: jest.fn(),
  findByField: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn(),
  delete: jest.fn(),
  findAllUsersByKeyword: jest.fn(),
};
const mockUserDao = userDao as jest.Mocked<IUserDao>;

describe('Auth Controller', () => {
  let authController: IAuthController;

  beforeEach(() => {
    authController = new AuthController(mockUserDao, mockLogger);

    mockRegisteredUser = mockUser;
    mockNonRegisteredUser = {
      ...mockRegisteredUser,
      id: '',
    };

    mockRequest = {
      method: '',
      url: '',
      path: '',
      headers: {},
      params: {},
      body: mockUser,
      query: {},
      responseType: 'text',
      user: mockUser,
    };
  });

  describe('login', () => {
    it('should return a db user for an existing user', async () => {
      const response: IHttpResponse<IUser> = await authController.login(
        mockRequest
      );
      expect(response.body).toBe(mockRegisteredUser);
    });
    it('it should create a new if the user does not exist', async () => {
      // After the user's client token gets authenticated by the middleware, req.user.id is empty
      // because the user is not yet registered in the database.
      mockRequest.body.id = '';
      const response: IHttpResponse<IUser> = await authController.login(
        mockRequest
      );
      expect(mockUserDao.create).toHaveBeenCalledWith(mockRequest.body);
      expect(response.body).toBe(mockRegisteredUser);
      expect(response.body).not.toBe(mockNonRegisteredUser);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const response: IHttpResponse<IUser> = await authController.register(
        mockRequest
      );
      expect(mockUserDao.create).toHaveBeenCalledWith(mockRequest.body);
      expect(response.body).toBe(mockUser);
    });
  });
});
