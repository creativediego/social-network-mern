// import express, { Express } from 'express';
// import { mockUserDao } from '../../mocks/daos/mockDaos';
// import { IHttpRequest } from '../../../../common/interfaces/IHttpRequest';
// import { IHttpResponse } from '../../../../common/interfaces/IHttpResponse';
// import { IBaseController } from '../../../../common/interfaces/IBaseController';
// import { UserController } from '../../../../features/user/controllers/UserController';
// import { mockUser, mockUsers } from '../../mocks/mockUsers';
// import { Code } from '../../../../common/enums/StatusCode';
// import { IUser } from '../../../../features/user/models/IUser';

// const app: Express = express();
// let mockRequest: IHttpRequest;
// let expectedResponse: IHttpResponse<IUser>;
// beforeEach(() => {
//   mockRequest = {
//     body: {
//       username: 'neoIamTheOne',
//       name: 'Keanu',
//       password: 'IAmTheOne123!',
//       email: 'neo@matrix.com',
//       bio: 'I am the one',
//       dateOfBirth: '1990-01-01',
//       headerImage: 'imagestring',
//       profilePhoto: 'profilephotostring',
//       accountType: 'Personal',
//     },
//     params: { userId: 666 },
//   };
//   expectedResponse = {
//     code: Code.ok,
//     body: {
//       ...mockUser,
//       id: mockRequest.params.userId,
//     },
//   };
// });
// const userController: IBaseController = new UserController(
//   'mock',
//   app,
//   new UserDaoMock()
// );

// describe('User Controller', () => {
//   test('create(): valid user', async () => {
//     const response: IHttpResponse<IUser> = await userController.create(
//       mockUser
//     );
//     expect(response.body).toBe(mockUser);
//   });
// test('create(): valid user', async () => {
//   const response: IHttpResponse = await userController.create(mockRequest);
//   expect(response.body).toBe(mockUser);
// });

// test('update()', async () => {
//   const actual: IHttpResponse = await userController.update(mockRequest);
//   expect(actual).toStrictEqual(expectedResponse);
// });

// test('findById()', async () => {
//   const actual: IHttpResponse = await userController.findById(mockRequest);
//   expect(actual).toStrictEqual(expectedResponse);
// });

// test('delete()', async () => {
//   const actual: IHttpResponse = await userController.delete(mockRequest);
//   expect(actual).toStrictEqual(expectedResponse);
// });

// test('findAll()', async () => {
//   const response: IHttpResponse = await userController.findAll();
//   expect(response.body).toBe(mockUsers);
// });
// });
