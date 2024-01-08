import dotenv from 'dotenv';
import configDatabase from '../../config/configDatabase';
import IUser from '../../models/users/IUser';
import IPost from '../../models/posts/IPost';
import { mockUser } from '../../__mocks__/mockUsers';
import IPostDao from './IPostDao';
import PostDao from './PostDao';
import PostModel from '../../mongoose/posts/PostModel';
import DaoErrorHandler from '../../errors/DaoErrorHandler';
import UserModel from '../../mongoose/users/UserModel';
import HashtagModel from '../../mongoose/hashtags/HashtagModel';
import UserDao from '../users/UserDao';
import IBaseDao from '../shared/IDao';
import mongoose, { ObjectId } from 'mongoose';
import { mockPosts } from '../../__mocks__/mockPosts';

dotenv.config();
let mockAuthor = mockUser;

const mockDbPosts = [
  { ...mockPosts[0], author: { _id: mockAuthor._id } },
  { ...mockPosts[1], author: { _id: mockAuthor._id } },
];
const postDao: IBaseDao<IPost> = new PostDao(
  PostModel,
  UserModel,
  HashtagModel,
  new DaoErrorHandler()
);

beforeAll(async () => {
  configDatabase(process.env.MONGO_DEV!);
  const userDao: IBaseDao<IUser> = new UserDao(
    UserModel,
    new DaoErrorHandler()
  );
  const createdUser: IUser = await userDao.create(mockAuthor);
});

afterAll(async () => {
  await mongoose.connection.dropCollection('users');
  await mongoose.connection.dropCollection('posts');
});

const createMockPost = async (message: string): Promise<IPost> => {
  return await postDao.create({
    post: message,
    author: mockAuthor._id,
  });
};

describe('PostDao', () => {
  test('create(): valid post', async () => {
    for (let i = 0; i < mockPosts.length; i++) {
      const dbPost: IPost = await postDao.create(mockPosts[i]);
      expect(dbPost).toMatchObject(mockDbPosts[i]);
    }
  });

  test('findAll()', async () => {
    const dbPosts: IPost[] = await postDao.findAll();
    for (let i = 0; i < mockPosts.length; i++) {
      expect(dbPosts[i]).toMatchObject(mockDbPosts[i]);
    }
  });

  test('findByUser(): a valid user with 2 posts', async () => {
    const userId: string = mockAuthor._id;
    const dbPosts: IPost[] = await postDao.findByField(userId);
    expect(dbPosts.length).toBe(2);
    for (const dbPost of dbPosts) {
      expect(dbPost).toMatchObject(userId);
    }
  });
  test('findById(): a valid post', async () => {
    const postToCreate: any = await createMockPost('hello!');

    const foundPost: any = await postDao.findOneById(postToCreate.id);
    expect(postToCreate.post).toStrictEqual(foundPost.post);
    expect(postToCreate.author.id).toStrictEqual(foundPost.author.id);
  });
  test('update(): a valid post', async () => {
    const postToCreate: any = await createMockPost('hola world');

    const updatedPost: any = await postDao.update(postToCreate.id, {
      post: 'updated!',
      author: postToCreate.author,
    });
    expect(updatedPost.post).toStrictEqual('updated!');
  });
  test('delete(): a valid post', async () => {
    const postToCreate: any = await createMockPost('goodbye world!');

    const deletedPost: any = await postDao.delete(postToCreate.id);
    expect(deletedPost.post).toStrictEqual('goodbye world!');
  });
});
