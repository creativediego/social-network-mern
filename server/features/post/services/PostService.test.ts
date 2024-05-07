// import { ServiceError } from '../../../common/errors/ServiceError';
// import { IHashtagDao } from '../../hashtag/daos/IHashTagDao';
// import { ILikeDao } from '../../like/daos/ILikeDao';
// import { ISocketService } from '../../socket/services/ISocketService';
// import { IUser } from '../../user/models/IUser';
// import { IPostDao } from '../daos/IPostDao';
// import { IPost } from '../models/IPost';
// import { IPostService } from './IPostService';
// import { PostService } from './PostService';
// import { jest } from '@jest/globals';
// import { SocketEvents } from '../../../common/enums/SocketEvents';
// import { mockUsers } from '../../../tests/mocks/mockUsers';
// import { mockPosts } from '../../../tests/mocks/mockPosts';
// import { IUserDao } from '../../user/daos/IUserDao';

// // TODO: Check if delete method should in fact return a boolean for the object itself.
// // ask to validate this term as best practices.
// // Then move on to a react components test.
// // Check how to develop the entire project offline.
// // Check code coverage table.
// // Ask if mocking the classes as object literals is ok instead of creating the classes themselves
// // check if having unit tests along side files and having integration tests separate is good
// // zip each feature, upload to chatGPT, and ask it to create an integration test

// // Mock dependencies for the PostService
// const userDao: IUserDao = {
//   findById: jest.fn(),
//   findOne: jest.fn(),
//   findAll: jest.fn(),
//   create: jest.fn(),
//   update: jest.fn(),
//   delete: jest.fn(),
//   findAllUsersByKeyword: jest.fn(),
// };
// const mockUserDao = userDao as jest.Mocked<IUserDao>;

// const postDao: IPostDao = {
//   create: jest.fn(),
//   findById: jest.fn(),
//   findOne: jest.fn(),
//   findAll: jest.fn(),
//   update: jest.fn(),
//   delete: jest.fn(),
//   findAllPostsByUserId: jest.fn(),
//   findAllPostsByHashtag: jest.fn(),
//   findAllPostsByKeyword: jest.fn(),
//   deleteManyByUser: jest.fn(),
// };
// const mockPostDao = postDao as jest.Mocked<IPostDao>;

// const likeDao: ILikeDao = {
//   createLike: jest.fn(),
//   findAllPostsLikedByUser: jest.fn(),
//   deleteManyByPostId: jest.fn(),
//   findAll: jest.fn(),
//   findById: jest.fn(),
//   findOne: jest.fn(),
//   create: jest.fn(),
//   update: jest.fn(),
//   delete: jest.fn(),
// };
// const mockLikeDao = likeDao as jest.Mocked<ILikeDao>;

// const hashtagDao: IHashtagDao = {
//   findAll: jest.fn(),
//   deleteManyByPostId: jest.fn(),
//   findById: jest.fn(),
//   findOne: jest.fn(),
//   create: jest.fn(),
//   update: jest.fn(),
//   delete: jest.fn(),
// };
// const mockHashtagDao = hashtagDao as jest.Mocked<IHashtagDao>;

// const socketService: ISocketService = {
//   emitToAll: jest.fn(),
//   handleOnConnect: jest.fn(),
//   handleOnDisconnect: jest.fn(),
//   emitToRoom: jest.fn(),
// };
// const mockSocketService = socketService as jest.Mocked<ISocketService>;

// // Mock a sample user and post
// const sampleUser: IUser = mockUsers[0];
// const samplePost: IPost = mockPosts[0];

// describe('PostService', () => {
//   let postService: IPostService;

//   beforeEach(() => {
//     postService = new PostService(
//       mockUserDao,
//       mockPostDao,
//       likeDao,
//       hashtagDao,
//       socketService
//     );
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('create', () => {
//     it('should create a new post', async () => {
//       mockUserDao.findById.mockResolvedValue(sampleUser);
//       mockPostDao.create.mockResolvedValue(samplePost);

//       const newPost = await postService.create(samplePost);

//       expect(mockUserDao.findById).toHaveBeenCalledWith(sampleUser.id);
//       expect(mockPostDao.create).toHaveBeenCalledWith(samplePost);
//       expect(socketService.emitToAll).toHaveBeenCalledWith(
//         SocketEvents.NEW_POST,
//         samplePost
//       );
//       expect(newPost).toEqual(samplePost);
//     });

//     it('should throw ServiceError if user does not exist', async () => {
//       mockUserDao.findById.mockResolvedValue(null);
//       await expect(postService.create(samplePost)).rejects.toThrowError(
//         ServiceError
//       );
//     });
//   });

//   describe('findById', () => {
//     it('should find a post by ID', async () => {
//       mockPostDao.findById.mockResolvedValue(samplePost);

//       const foundPost = await postService.findById(samplePost.id);

//       expect(mockPostDao.findById).toHaveBeenCalledWith(samplePost.id);
//       expect(foundPost).toEqual(samplePost);
//     });

//     it('should return null if post does not exist', async () => {
//       mockPostDao.findById.mockResolvedValue(null);

//       const foundPost = await postService.findById('nonExistentId');

//       expect(mockPostDao.findById).toHaveBeenCalledWith('nonExistentId');
//       expect(foundPost).toBeNull();
//     });
//   });

//   describe('findOne', () => {
//     it('should find a post based on criteria', async () => {
//       mockPostDao.findOne.mockResolvedValue(samplePost);

//       const foundPost = await postService.findOne({ post: samplePost.post });

//       expect(mockPostDao.findOne).toHaveBeenCalledWith({
//         post: samplePost.post,
//       });
//       expect(foundPost).toEqual(samplePost);
//     });

//     it('should return null if no matching post is found', async () => {
//       mockPostDao.findOne.mockResolvedValue(null);

//       const foundPost = await postService.findOne({ id: 'nonExistentId' });

//       expect(mockPostDao.findOne).toHaveBeenCalledWith({ id: 'nonExistentId' });
//       expect(foundPost).toBeNull();
//     });
//   });

//   describe('findAll', () => {
//     it('should find all posts based on criteria', async () => {
//       mockPostDao.findAll.mockResolvedValue([samplePost]);

//       const foundPosts = await postService.findAll({ post: samplePost.post });

//       expect(mockPostDao.findAll).toHaveBeenCalledWith(
//         { post: samplePost.post },
//         undefined,
//         undefined
//       );
//       expect(foundPosts).toEqual([samplePost]);
//     });

//     it('should find all posts with pagination', async () => {
//       mockPostDao.findAll.mockResolvedValue([samplePost]);

//       const foundPosts = await postService.findAll(
//         { author: sampleUser },
//         1,
//         10
//       );

//       expect(mockPostDao.findAll).toHaveBeenCalledWith(
//         { author: sampleUser },
//         1,
//         10
//       );
//       expect(foundPosts).toEqual([samplePost]);
//     });
//   });

//   describe('update', () => {
//     it('should update an existing post', async () => {
//       mockPostDao.findById.mockResolvedValue(samplePost);
//       mockPostDao.update.mockResolvedValue({
//         ...samplePost,
//         post: 'Updated Content',
//       });

//       const updatedPost = await postService.update(samplePost.id, {
//         post: 'Updated Content',
//       });

//       expect(mockPostDao.findById).toHaveBeenCalledWith(samplePost.id);
//       expect(mockPostDao.update).toHaveBeenCalledWith(samplePost.id, {
//         post: 'Updated Content',
//       });
//       expect(socketService.emitToAll).toHaveBeenCalledWith(
//         SocketEvents.UPDATED_POST,
//         {
//           ...samplePost,
//           post: 'Updated Content',
//         }
//       );
//       expect(updatedPost).toEqual({
//         ...samplePost,
//         post: 'Updated Content',
//       });
//     });

//     it('should throw ServiceError if post does not exist', async () => {
//       mockPostDao.findById.mockResolvedValue(null);

//       await expect(
//         postService.update('nonExistentId', { post: 'Updated Content' })
//       ).rejects.toThrowError(ServiceError);
//     });
//   });

//   describe('findAllPostsByHashtag', () => {
//     it('should find all posts by hashtag', async () => {
//       mockHashtagDao.findAll.mockResolvedValue([
//         { post: samplePost, hashtag: 'sampleHashTag' },
//       ]);

//       const foundPosts = await postService.findAllPostsByHashtag(
//         'sampleHashtag'
//       );

//       expect(hashtagDao.findAll).toHaveBeenCalledWith({
//         hashtag: 'sampleHashtag',
//       });
//       expect(foundPosts).toEqual([samplePost]);
//     });
//   });

//   describe('findAllPostsByUser', () => {
//     it('should find all posts by user', async () => {
//       mockUserDao.findById.mockResolvedValue(sampleUser);
//       mockPostDao.findAll.mockResolvedValue([samplePost]);

//       const foundPosts = await postService.findAllPostsByUser('sampleUserId', 2, 10);

//       expect(mockUserDao.findById).toHaveBeenCalledWith('sampleUserId');
//       expect(mockPostDao.findAll).toHaveBeenCalledWith({ author: sampleUser });
//       expect(foundPosts).toEqual([samplePost]);
//     });

//     it('should throw ServiceError if user does not exist', async () => {
//       mockUserDao.findById.mockResolvedValue(null);

//       await expect(
//         postService.findAllPostsByUser('nonExistentUserId')
//       ).rejects.toThrowError(ServiceError);
//     });
//   });
//   describe('delete', () => {
//     it('should delete an existing post and associated data', async () => {
//       mockPostDao.findById.mockResolvedValue(samplePost);
//       mockPostDao.delete.mockResolvedValue(true);

//       const deleted = await postService.delete(samplePost.id);

//       expect(mockPostDao.findById).toHaveBeenCalledWith(samplePost.id);
//       expect(mockPostDao.delete).toHaveBeenCalledWith(samplePost.id);
//       expect(hashtagDao.deleteManyByPostId).toHaveBeenCalledWith(samplePost.id);
//       expect(likeDao.deleteManyByPostId).toHaveBeenCalledWith(samplePost.id);
//       expect(socketService.emitToAll).toHaveBeenCalledWith(
//         SocketEvents.DELETED_POST,
//         samplePost.id
//       );
//       expect(deleted).toBe(true);
//     });

//     it('should throw ServiceError if post does not exist', async () => {
//       mockPostDao.findById.mockResolvedValue(null);

//       await expect(postService.delete('nonExistentId')).rejects.toThrowError(
//         ServiceError
//       );
//     });
//   });
// });
