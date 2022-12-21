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
/**
 * @file
 * Container that instantiates all Daos and their dependencies.
 */
const daoErrorHandler = new DaoErrorHandler();
export const userDao: IDao<IUser> = new UserDao(UserModel, daoErrorHandler);
export const bookmarkDao: IBookMarkDao = new BookmarkDao(
  BookmarkModel,
  daoErrorHandler
);
export const followDao: IFollowDao = new FollowDao(
  FollowModel,
  daoErrorHandler
);
export const likeDao: ILikeDao = new LikeDao(
  LikeModel,
  DislikeModel,
  PostModel,
  daoErrorHandler
);
export const postDao: IDao<IPost> = new PostDao(
  PostModel,
  UserModel,
  HashtagModel,
  daoErrorHandler
);
export const messageDao: IMessageDao = new MessageDao(
  MessageModel,
  ConversationModel,
  daoErrorHandler
);

export const notificationDao: NotificationDao = NotificationDao.getInstance();