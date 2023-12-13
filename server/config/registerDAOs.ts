import BookmarkDao from '../daos/bookmarks/BookmarkDao';
import IBookMarkDao from '../daos/bookmarks/IBookmarkDao';
import FollowDao from '../daos/follows/FollowDao';
import IFollowDao from '../daos/follows/IFollowDao';
import ILikeDao from '../daos/likes/ILikeDao';
import { LikeDao } from '../daos/likes/LikeDao';
import IMessageDao from '../daos/messages/IMessageDao';
import MessageDao from '../daos/messages/MessageDao';
import NotificationDao from '../daos/notifications/NotificationsDao';
import IDao from '../daos/shared/IDao';
import PostDao from '../daos/posts/PostDao';
import UserDao from '../daos/users/UserDao';
import DaoErrorHandler from '../errors/DaoErrorHandler';
import IPost from '../models/posts/IPost';
import IUser from '../models/users/IUser';
import BookmarkModel from '../mongoose/bookmarks/BookmarkModel';
import DislikeModel from '../mongoose/dislikes/DislikeModel';
import FollowModel from '../mongoose/follows/FollowModel';
import HashtagModel from '../mongoose/hashtags/HashtagModel';
import LikeModel from '../mongoose/likes/LikeModel';
import ConversationModel from '../mongoose/messages/ConversationModel';
import MessageModel from '../mongoose/messages/MessageModel';
import PostModel from '../mongoose/posts/PostModel';
import UserModel from '../mongoose/users/UserModel';
import { IDependencyContainer } from './IDependencyContainer';
import IErrorHandler from '../errors/IErrorHandler';
import { Dep } from './Dependencies';

/**
 * @file
 * Registers all the DAOs and their model dependencies using the parameterized dependency injection container.
 */

export const registerDAOs = (container: IDependencyContainer): void => {
  container.register(Dep.DaoErrorHandler, [], () => new DaoErrorHandler());
  container.register(
    Dep.BookmarkDao,
    [Dep.DaoErrorHandler],
    (daoErrorHandler: IErrorHandler) =>
      new BookmarkDao(BookmarkModel, daoErrorHandler)
  );
  container.register(
    Dep.UserDao,
    [Dep.DaoErrorHandler],
    (daoErrorHandler: IErrorHandler) => new UserDao(UserModel, daoErrorHandler)
  );
  container.register(
    Dep.FollowDao,
    [Dep.DaoErrorHandler],
    (daoErrorHandler: IErrorHandler) =>
      new FollowDao(FollowModel, daoErrorHandler)
  );

  container.register(
    Dep.LikeDao,
    [Dep.DaoErrorHandler],
    (daoErrorHandler: IErrorHandler) =>
      new LikeDao(LikeModel, DislikeModel, PostModel, daoErrorHandler)
  );

  container.register(
    Dep.PostDao,
    [Dep.DaoErrorHandler],
    (daoErrorHandler: IErrorHandler) =>
      new PostDao(PostModel, UserModel, HashtagModel, daoErrorHandler)
  );

  container.register(
    Dep.MessageDao,
    [Dep.DaoErrorHandler],
    (daoErrorHandler: IErrorHandler) =>
      new MessageDao(MessageModel, ConversationModel, daoErrorHandler)
  );

  container.register(Dep.NotificationDao, [], () =>
    NotificationDao.getInstance()
  );
};
