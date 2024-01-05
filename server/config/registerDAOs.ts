import BookmarkDao from '../daos/bookmarks/BookmarkDao';
import FollowDao from '../daos/follows/FollowDao';
import { LikeDao } from '../daos/likes/LikeDao';
import MessageDao from '../daos/messages/MessageDao';
import NotificationDao from '../daos/notifications/NotificationsDao';
import PostDao from '../daos/posts/PostDao';
import UserDao from '../daos/users/UserDao';
import DaoErrorHandler from '../errors/DaoErrorHandler';
import BookmarkModel from '../mongoose/bookmarks/BookmarkModel';
import DislikeModel from '../mongoose/dislikes/DislikeModel';
import FollowModel from '../mongoose/follows/FollowModel';
import HashtagModel from '../mongoose/hashtags/HashtagModel';
import LikeModel from '../mongoose/likes/LikeModel';
import ConversationModel from '../mongoose/messages/ChatModel';
import MessageModel from '../mongoose/messages/MessageModel';
import PostModel from '../mongoose/posts/PostModel';
import UserModel from '../mongoose/users/UserModel';
import { IDependencyContainer } from './IDependencyContainer';
import IErrorHandler from '../errors/IErrorHandler';
import { Dep } from './Dependencies';

/**
 * registerDAOs function.
 *
 * This function registers all Data Access Objects (DAOs) and their model dependencies in the dependency container.
 * Each DAO is registered with its name, a list of its dependencies, and a factory function that creates an instance of the DAO.
 *
 * The factory function takes the dependencies of the DAO as parameters and returns a new instance of the DAO.
 *
 * @param {IDependencyContainer} container - The dependency container.
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
