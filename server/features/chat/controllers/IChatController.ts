import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import { IChat } from '../models/chat/IChat';
import { IChatMessage } from '../models/message/IChatMessage';

/**
 * Represents the interface of a message resource controller.
 */
export default interface IChatController {
  findMessagesByChat(req: IHttpRequest): Promise<IHttpResponse<IChatMessage[]>>;
  findInboxMessages(req: IHttpRequest): Promise<IHttpResponse<IChatMessage[]>>;
  markMessageRead(req: IHttpRequest): Promise<IHttpResponse<IChatMessage>>;
  getUnreadChatCount(req: IHttpRequest): Promise<IHttpResponse<number>>;
  getUnreadChatIds(req: IHttpRequest): Promise<IHttpResponse<string[]>>;
  createChat(req: IHttpRequest): Promise<IHttpResponse<IChat>>;
  findChatById(req: IHttpRequest): Promise<IHttpResponse<IChat>>;
  createMessage(req: IHttpRequest): Promise<IHttpResponse<IChatMessage>>;
  deleteMessage(req: IHttpRequest): Promise<IHttpResponse<IChatMessage>>;
  deleteChat(req: IHttpRequest): Promise<IHttpResponse<IChat>>;
}
