import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';

/**
 * Represents the interface of a message resource controller.
 */
export default interface IMessageController {
  findMessagesByChat(req: HttpRequest): Promise<HttpResponse>;
  findInboxMessages(req: HttpRequest): Promise<HttpResponse>;
  findMessagesUserSent(req: HttpRequest): Promise<HttpResponse>;
  createChat(req: HttpRequest): Promise<HttpResponse>;
  findChat(req: HttpRequest): Promise<HttpResponse>;
  createMessage(req: HttpRequest): Promise<HttpResponse>;
  deleteMessage(req: HttpRequest): Promise<HttpResponse>;
  deleteChat(req: HttpRequest): Promise<HttpResponse>;
}
