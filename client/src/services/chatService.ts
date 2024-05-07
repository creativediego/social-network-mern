import { urlConfig } from '../config/appConfig';
import { IChat } from '../interfaces/IChat';
import { IMessage } from '../interfaces/IMessage';
import { APIServiceI, ReqType, apiService } from './APIService';

const CHAT_API_URL = urlConfig.chatApi;

export interface IChatService {
  findChat(chatId: string): Promise<IChat>;
  createChat(chat: IChat): Promise<IChat>;
  deleteChat(chatId: string): Promise<IChat>;
  getUnreadChatCount(): Promise<number>;
  getUnreadChatIds(): Promise<string[]>;
  markMessageRead(messageId: string): Promise<IMessage>;
  findInboxChats(userId: string): Promise<IMessage[]>;
  findMessagesByChat(chatId: string): Promise<IMessage[]>;
  findMessagesUserSent(userId: string): Promise<IMessage[]>;
  sendMessage(message: IMessage): Promise<IMessage>;
  deleteMessage(messageId: string): Promise<IMessage>;
}

// implement the interface with singleton pattern. Also taken in a url and an APIServiceI as a dependency.
class ChatServiceImpl implements IChatService {
  private url: string;
  private APIService: APIServiceI;

  private constructor(url: string, apiService: APIServiceI) {
    this.url = url;
    this.APIService = apiService;
    Object.freeze(this);
  }

  public static getInstance(
    url: string,
    APIService: APIServiceI
  ): ChatServiceImpl {
    return new ChatServiceImpl(url, APIService);
  }

  public findChat = async (chatId: string): Promise<IChat> => {
    const url = `${this.url}/${chatId}`;
    return await this.APIService.makeRequest<IChat>(
      url,
      ReqType.GET,
      'Error finding chat. Try again later.'
    );
  };

  public createChat = async (chat: IChat): Promise<IChat> => {
    return await this.APIService.makeRequest<IChat, IChat>(
      this.url,
      ReqType.POST,
      'Error creating chat. Try again later.',
      chat
    );
  };

  public deleteChat = async (chatId: string): Promise<IChat> => {
    const url = `${this.url}/${chatId}`;
    return await this.APIService.makeRequest<IChat>(
      url,
      ReqType.DELETE,
      'Error deleting chat. Try again later.'
    );
  };

  public getUnreadChatCount(): Promise<number> {
    const url = `${this.url}/count`;
    return this.APIService.makeRequest<number>(
      url,
      ReqType.GET,
      'Error getting new message notifications. Try again later.'
    );
  }

  public getUnreadChatIds(): Promise<string[]> {
    const url = `${this.url}/unread`;
    return this.APIService.makeRequest<string[]>(
      url,
      ReqType.GET,
      'Error getting new message notifications. Try again later.'
    );
  }

  public findInboxChats = async (userId: string): Promise<IMessage[]> => {
    const url = `${this.url}`;
    return await this.APIService.makeRequest<IMessage[]>(
      url,
      ReqType.GET,
      'Error finding inbox chats. Try again later.'
    );
  };

  public findMessagesByChat = async (chatId: string): Promise<IMessage[]> => {
    const url = `${this.url}/${chatId}/messages`;
    return await this.APIService.makeRequest<IMessage[]>(
      url,
      ReqType.GET,
      'Error finding messages by chat. Try again later.'
    );
  };

  public markMessageRead = async (messageId: string): Promise<IMessage> => {
    const url = `${this.url}/messages/${messageId}`;
    return await this.APIService.makeRequest<IMessage>(
      url,
      ReqType.PUT,
      'Error marking message as read. Try again later.'
    );
  };

  public findMessagesUserSent = async (userId: string): Promise<IMessage[]> => {
    const url = `${this.url}/messages/sent`;
    return await this.APIService.makeRequest<IMessage[]>(
      url,
      ReqType.GET,
      'Error finding messages user sent. Try again later.'
    );
  };

  sendMessage(message: IMessage): Promise<IMessage> {
    const url = `${this.url}/${message.chatId}/messages`;
    return this.APIService.makeRequest<IMessage, IMessage>(
      url,
      ReqType.POST,
      'Error sending message. Try again later.',
      message
    );
  }
  deleteMessage(messageId: string): Promise<IMessage> {
    const url = `${this.url}/messages/${messageId}`;
    return this.APIService.makeRequest<IMessage>(
      url,
      ReqType.DELETE,
      'Error deleting message. Try again later.'
    );
  }
}

const chatService = ChatServiceImpl.getInstance(CHAT_API_URL, apiService);

export { ChatServiceImpl, chatService };
