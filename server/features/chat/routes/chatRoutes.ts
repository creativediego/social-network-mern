import { Router } from 'express';
import { IDependencyContainer } from '../../../common/interfaces/IDependencyContainer';
import { Dep } from '../../../config/Dependencies';
import { adaptRequest } from '../../../common/middleware/adaptRequest';
import { isAuthenticated } from '../../../common/auth/util/isAuthenticated';
import IChatController from '../controllers/IChatController';

/**
 * Express routes for chat-related endpoints. It contains routes for finding inbox messages, getting unread chat ids, getting the number of unread chats, finding a chat by id, creating a chat, deleting a chat, finding messages by chat, creating a message, deleting a message, and marking a message as read. It uses the ChatController to handle each route.
 * @param dependencyContainer
 * @returns
 */
export function configChatRoutes(
  dependencyContainer: IDependencyContainer
): Router {
  const chatController = dependencyContainer.resolve<IChatController>(
    Dep.ChatController
  );
  const router: Router = Router();

  router.get(
    '/',
    isAuthenticated,
    adaptRequest(chatController.findInboxMessages)
  );

  router.get(
    '/unread',
    isAuthenticated,
    adaptRequest(chatController.getUnreadChatIds)
  );

  router.get(
    '/unread/count',
    isAuthenticated,
    adaptRequest(chatController.getUnreadChatCount)
  );

  router.get(
    '/:chatId',
    isAuthenticated,
    adaptRequest(chatController.findChatById)
  );

  router.post('/', isAuthenticated, adaptRequest(chatController.createChat));

  router.delete(
    '/:chatId',
    isAuthenticated,
    adaptRequest(chatController.deleteChat)
  );

  router.get(
    '/:chatId/messages',
    isAuthenticated,
    adaptRequest(chatController.findMessagesByChat)
  );

  router.post(
    '/:chatId/messages',
    isAuthenticated,
    adaptRequest(chatController.createMessage)
  );

  router.delete(
    '/messages/:messageId',
    isAuthenticated,
    adaptRequest(chatController.deleteMessage)
  );

  router.put(
    '/messages/:messageId',
    isAuthenticated,
    adaptRequest(chatController.markMessageRead)
  );

  return router;
}
