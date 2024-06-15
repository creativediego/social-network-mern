import { LikeDao } from '../features/like/daos/LikeDao';
import { NotificationDao } from '../features/notification/daos/NotificationDao';
import { PostDao } from '../features/post/daos/PostDao';
import { UserDao } from '../features/user/daos/UserDao';
import HashtagModel from '../features/hashtag/models/HashtagModel';
import LikeModel from '../features/like/models/LikeModel';
import ChatModel from '../features/chat/models/chat/ChatModel';
import MessageModel from '../features/chat/models/message/ChatMessageModel';
import PostModel from '../features/post/models/PostModel';
import UserModel from '../features/user/models/UserModel';
import { IDependencyContainer } from '../common/interfaces/IDependencyContainer';
import { Dep } from './Dependencies';
import { HashTagDao } from '../features/hashtag/daos/HashtagDao';
import NotificationModel from '../features/notification/models/NotificationModel';
import { ChatDao } from '../features/chat/daos/ChatDao';
import FollowDao from '../features/follow/daos/FollowDao';
import FollowModel from '../features/follow/models/FollowModel';

/**
 * This function registers all Data Access Objects (DAOs) and their model dependencies in the dependency container.
 * Each DAO is registered with its name, a list of its dependencies, and a factory function that creates an instance of the DAO.
 *
 * The factory function takes the dependencies of the DAO as parameters and returns a new instance of the DAO.
 *
 * @param {IDependencyContainer} container - The dependency container.
 */

export const registerDAOs = (container: IDependencyContainer): void => {
  container.register(Dep.UserDao, [], () => new UserDao(UserModel));
  container.register(Dep.PostDao, [], () => new PostDao(PostModel));
  container.register(Dep.LikeDao, [], () => new LikeDao(LikeModel));
  container.register(Dep.FollowDao, [], () => new FollowDao(FollowModel));
  container.register(
    Dep.ChatDao,
    [],
    () => new ChatDao(MessageModel, ChatModel)
  );
  container.register(Dep.HashtagDao, [], () => new HashTagDao(HashtagModel));
  container.register(
    Dep.NotificationDao,
    [],
    () => new NotificationDao(NotificationModel)
  );
};
