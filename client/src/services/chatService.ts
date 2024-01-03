import { urlConfig } from '../config/appConfig';
import { IChat } from '../interfaces/IChat';
import { IMessage } from '../interfaces/IMessage';
import { APIServiceI, Requests, apiService } from './APIService';

const CHAT_API_URL = urlConfig.chatApi;

export interface IChatService {
  findChat(chatId: string): Promise<IChat>;
  createChat(chat: IChat): Promise<IChat>;
  deleteChat(chatId: string): Promise<IChat>;
  findInboxMessages(userId: string): Promise<IMessage[]>;
  findMessagesByChat(chatId: string): Promise<IMessage[]>;
  findMessagesUserSent(userId: string): Promise<IMessage[]>;
  sendMessage(chatId: string, content: string): Promise<IMessage>;
  deleteMessage(message: IMessage): Promise<IMessage>;
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
      Requests.GET,
      'Error finding chat. Try again later.'
    );
  };

  public createChat = async (chat: IChat): Promise<IChat> => {
    return await this.APIService.makeRequest<IChat, IChat>(
      this.url,
      Requests.POST,
      'Error creating chat. Try again later.',
      chat
    );
  };

  public deleteChat = async (chatId: string): Promise<IChat> => {
    const url = `${this.url}/${chatId}`;
    return await this.APIService.makeRequest<IChat>(
      url,
      Requests.DELETE,
      'Error deleting chat. Try again later.'
    );
  };

  public findInboxMessages = async (userId: string): Promise<IMessage[]> => {
    const url = `${this.url}/messages/inbox`;
    return await this.APIService.makeRequest<IMessage[]>(
      url,
      Requests.GET,
      'Error finding inbox messages. Try again later.'
    );
  };

  public findMessagesByChat = async (chatId: string): Promise<IMessage[]> => {
    const url = `${this.url}/${chatId}/messages`;
    return await this.APIService.makeRequest<IMessage[]>(
      url,
      Requests.GET,
      'Error finding messages by chat. Try again later.'
    );
  };

  public findMessagesUserSent = async (userId: string): Promise<IMessage[]> => {
    const url = `${this.url}/messages/sent`;
    return await this.APIService.makeRequest<IMessage[]>(
      url,
      Requests.GET,
      'Error finding messages user sent. Try again later.'
    );
  };

  sendMessage(chatId: string, content: string): Promise<IMessage> {
    const url = `${this.url}/${chatId}/messages`;
    return this.APIService.makeRequest<IMessage, { content: string }>(
      url,
      Requests.POST,
      'Error sending message. Try again later.',
      { content }
    );
  }
  deleteMessage(message: IMessage): Promise<IMessage> {
    const url = `${this.url}/${message.chatId}/messages/${message.id}`;
    return this.APIService.makeRequest<IMessage>(
      url,
      Requests.DELETE,
      'Error deleting message. Try again later.'
    );
  }
}

export const chatService = ChatServiceImpl.getInstance(
  CHAT_API_URL,
  apiService
);
