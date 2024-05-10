import { IPostService } from '../../features/post/services/IPostService';
import { ISocketService } from '../../features/socket/services/ISocketService';
import { mockPosts } from './mockPosts';

export const mockPostService: IPostService = {
  findAllPostsByKeyword: jest.fn(),
  findAllPostsByAuthorId: jest.fn(),
  findAll: jest.fn().mockResolvedValue(mockPosts),
  findById: jest.fn().mockResolvedValue(mockPosts[0]),
  create: jest.fn().mockResolvedValue(mockPosts[0]),
  update: jest.fn(),
  delete: jest.fn(),
};

export const mockSocketService: ISocketService = {
  handleOnConnect: jest.fn(),
  handleOnDisconnect: jest.fn(),
  emitToUser: jest.fn(),
  emitToAllUsers: jest.fn(),
};
