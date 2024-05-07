// Mock for the IUserDao
import { IHashtagDao } from '../../features/hashtag/daos/IHashTagDao';
import { ILikeDao } from '../../features/like/daos/ILikeDao';
import { ILike } from '../../features/like/models/ILike';
import { IPostDao } from '../../features/post/daos/IPostDao';
import { IPost } from '../../features/post/models/IPost';
import { IUserDao } from '../../features/user/daos/IUserDao';
import { mockPosts } from './mockPosts';
import { mockUsers } from './mockUsers';

const mockUser = mockUsers[0];
export const mockUserDao: IUserDao = {
  findById: jest.fn(),
  findByField: jest.fn().mockReturnValue(mockUser),
  findAll: jest.fn(),
  create: jest.fn().mockReturnValue(mockUser),
  update: jest.fn(),
  delete: jest.fn(),
  findAllUsersByKeyword: jest.fn(),
};

export const mockPostDao: IPostDao = {
  create: jest.fn().mockResolvedValue(mockPosts[0]),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAllPostsByAuthorId: jest.fn(),
  findAllPostsByKeyword: jest.fn(),
  deleteManyByAuthorId: jest.fn(),
};

export const mockLikeDao: ILikeDao = {
  createLike: jest.fn(),
  findAllPostsLikedByUser: jest.fn(),
  deleteManyByPostId: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const mockHashtagDao: IHashtagDao = {
  deleteManyByPostId: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
