import mongoose from 'mongoose';
import { PostDao } from '../../../../features/post/daos/PostDao';
import { DatabaseError } from '../../../../common/errors/DatabaseError';
import { IPost } from '../../../../features/post/models/IPost';
import { mockUsers } from '../../../mocks/mockUsers';
import { InMemoryMongoServer } from '../../../mocks/configInMemoryMongo';
import { IUser } from '../../../../features/user/models/IUser';
import UserSchema from '../../../../features/user/models/UserSchema';
import PostSchema from '../../../../features/post/models/PostSchema';
import { mockPosts } from '../../../mocks/mockPosts';
import { FilterOptions } from '../../../../common/interfaces/IBaseDao';

let mongoServer: InMemoryMongoServer;
let postDao: PostDao;
let mockUser: IUser;
let UserModel: mongoose.Model<IUser, {}, {}, {}, any>;
let PostModel: mongoose.Model<IPost, {}, {}, {}, any>;

beforeAll(async () => {
  mongoServer = new InMemoryMongoServer();
  await mongoServer.connect();
  PostModel = mongoose.model<IPost>('PostModel', PostSchema);
  UserModel = mongoose.model<IUser>('UserModel', UserSchema);
  postDao = new PostDao(PostModel);
});

afterAll(async () => {
  await mongoServer.disconnect();
});

describe('PostDao', () => {
  beforeEach(async () => {
    mockUser = await UserModel.create(mockUsers[0]);
  });
  afterEach(async () => {
    await mongoServer.clearDatabase();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const postData: IPost = mockPosts[0];
      postData.author = mockUser;
      const createdPost = await postDao.create(postData);
      expect(createdPost.post).toBe('post 1');
      expect(createdPost.author.id).toBe(mockUser.id); // The author should be populated
    });

    it('should throw DatabaseError if the creation fails', async () => {
      const createSpy = jest.spyOn(PostModel.prototype, 'save');
      createSpy.mockRejectedValue(new Error('Database error'));

      const postData: IPost = mockPosts[0];

      try {
        await postDao.create(postData);
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseError);
      } finally {
        createSpy.mockRestore();
      }
    });
  });

  describe('findById', () => {
    it('should find a post by ID', async () => {
      const createdPost = await postDao.create({
        ...mockPosts[0],
        author: mockUser,
      });
      const foundPost = await postDao.findById(createdPost.id);

      expect(foundPost).toBeDefined();
      expect(foundPost?.id).toBe(createdPost.id);
      expect(foundPost?.author.id).toBe(mockUser.id); // The author should be populated
    });

    it('should return null if no post is found for the given ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toHexString();
      const foundPost = await postDao.findById(nonExistentId);
      expect(foundPost).toBeNull();
    });

    it('should throw DatabaseError if findById fails', async () => {
      try {
        await postDao.findById('bad id here');
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseError);
      }
    });
  });

  describe('findAll', () => {
    it('should return an empty array if no posts exist', async () => {
      const allPosts = await postDao.findAll();

      expect(allPosts).toEqual([]);
    });

    it('should return an array of posts if they exist', async () => {
      const postData1: IPost = mockPosts[0];
      postData1.author = mockUser;
      const postData2: IPost = mockPosts[1];
      postData2.author = mockUser;

      await postDao.create(postData1);
      await postDao.create(postData2);

      const allPosts = await postDao.findAll();

      expect(allPosts).toHaveLength(2);
      expect(allPosts[0].author.id).toBe(mockUser.id); // The author should be populated
    });
  });

  describe('findAll', () => {
    it('should return posts with pagination and sorting', async () => {
      // Insert test data into the database
      const postData1: IPost = mockPosts[0];
      postData1.author = mockUser;
      const postData2: IPost = mockPosts[1];
      postData2.author = mockUser;
      const postData3: IPost = mockPosts[2];
      postData3.author = mockUser;
      const postData4: IPost = mockPosts[3];
      postData4.author = mockUser;

      await postDao.create(postData1);
      await postDao.create(postData2);
      await postDao.create(postData3);
      await postDao.create(postData4);

      const options: FilterOptions<IPost> = {
        page: 4,
        limit: 1,
        orderBy: 'createdAt',
        order: 'desc',
      };

      const posts = await postDao.findAll(options);

      expect(posts).toHaveLength(1);
      expect(posts[0].post).toBe('post 1'); // The first created since we are sorting by createdAt in descending order
    });
  });

  describe('findAllPostsByUserId', () => {
    it('should return an empty array if no posts exist for the given user', async () => {
      const allPosts = await postDao.findAllPostsByAuthorId(mockUser.id);
      expect(allPosts).toEqual([]);
    });

    it('should return an array of posts if they exist for the given user', async () => {
      const postData1: IPost = mockPosts[0];
      postData1.author = mockUser;
      const postData2: IPost = mockPosts[1];
      postData2.author = mockUser;

      await postDao.create(postData1);
      await postDao.create(postData2);

      const allPosts = await postDao.findAllPostsByAuthorId(mockUser.id);

      expect(allPosts).toHaveLength(2);
      expect(allPosts[0].author.id).toBe(mockUser.id); // The author should be populated
    });
  });

  describe('findAllPostsByKeyword', () => {
    it('should return an empty array if no posts exist for the given keyword', async () => {
      const allPosts = await postDao.findAllPostsByKeyword('test');

      expect(allPosts).toEqual([]);
    });

    it('should return an array of posts if they exist for the given keyword  with filter options', async () => {
      const postData1: IPost = mockPosts[0];
      postData1.post = 'This is a #test post.';
      postData1.author = mockUser;
      const postData2: IPost = mockPosts[1];
      postData2.post = 'This is a test post.';
      postData2.author = mockUser;

      const createdPost1 = await postDao.create(postData1);
      await postDao.create(postData2);

      const filter: FilterOptions<IPost> = {
        order: 'desc',
      };
      const allPosts1 = await postDao.findAllPostsByKeyword('#test');
      const allPosts2 = await postDao.findAllPostsByKeyword('post');

      expect(allPosts1[0].id).toBe(createdPost1.id);
      expect(allPosts1[0].author.id).toBe(mockUser.id); // The author should be populated
      expect(allPosts1).toHaveLength(1);
      expect(allPosts2).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const postData: IPost = {
        id: '1',
        post: 'This is a test post.',
        author: mockUser,
        stats: {
          likes: 0,
          dislikes: 0,
          replies: 0,
          reposts: 0,
        },
        likedBy: [],
        dislikedBy: [],
        hashtags: ['test'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdPost = await postDao.create(postData);

      const updatedData: Partial<IPost> = {
        post: 'Updated post content',
      };

      const updatedPost = await postDao.update(createdPost.id, updatedData);

      expect(updatedPost?.post).toBe('Updated post content');
      expect(updatedPost.author.id).toBe(mockUser.id); // The author should be populated
    });

    it('should throw error if the id of the updated post is invalid', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toHexString();
      const updatedData: Partial<IPost> = {
        post: 'Updated post content',
      };
      try {
        const updatedPost = await postDao.update(nonExistentId, updatedData);
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseError);
      }
    });
  });

  describe('delete', () => {
    it('should delete a post by ID', async () => {
      const postData: IPost = {
        id: '1',
        post: 'This is a test post.',
        author: mockUser,
        stats: {
          likes: 0,
          dislikes: 0,
          replies: 0,
          reposts: 0,
        },
        likedBy: [],
        dislikedBy: [],
        hashtags: ['test'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdPost = await postDao.create(postData);

      const isDeleted = await postDao.delete(createdPost.id);

      expect(isDeleted).toBeTruthy();
      const foundPost = await postDao.findById(createdPost.id);
      expect(foundPost).toBeNull();
    });

    it('should return false if no post is found for the given ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toHexString();

      const isDeleted = await postDao.delete(nonExistentId);

      expect(isDeleted).toBeFalsy();
    });
  });

  describe('deleteManyByAuthorId', () => {
    it('should delete all posts by author ID', async () => {
      const createPost1 = await postDao.create({
        ...mockPosts[0],
        author: mockUser,
      });
      const createPost2 = await postDao.create({
        ...mockPosts[1],
        author: mockUser,
      });

      const deletedCount = await postDao.deleteManyByAuthorId(mockUser.id);
      expect(deletedCount).toBe(2);
      const postByAuthor = await postDao.findAllPostsByAuthorId(mockUser.id);
      console.log(postByAuthor);
      expect(postByAuthor).toEqual([]);
    });
  });
});
