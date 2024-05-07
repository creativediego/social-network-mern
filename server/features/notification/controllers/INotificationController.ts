import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import { INotification } from '../models/INotification';

export interface INotificationController {
  findNotifications: (
    req: IHttpRequest
  ) => Promise<IHttpResponse<INotification[]>>;
  getNotificationCount: (req: IHttpRequest) => Promise<IHttpResponse<number>>;
  markNotificationRead: (
    req: IHttpRequest
  ) => Promise<IHttpResponse<INotification>>;
}
