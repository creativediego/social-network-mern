import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import {
  okResponse,
  noContentResponse,
} from '../../../common/util/httpResponses';
import { INotification } from '../models/INotification';
import { INotificationDao } from '../daos/NotificationDao';
import { INotificationController } from './INotificationController';
import { ILogger } from '../../../common/logger/ILogger';
import { ok } from 'assert';
/**
 * Represents the implementation for handling the notifications resource api.
 * @class
 */
export default class NotificationController implements INotificationController {
  private readonly notificationDao: INotificationDao;
  private readonly logger: ILogger;

  constructor(notificationDao: INotificationDao, logger: ILogger) {
    this.notificationDao = notificationDao;
    this.logger = logger;
    Object.freeze(this); // Make this object immutable.
  }

  findNotifications = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<INotification[]>> => {
    const notifications: INotification[] =
      await this.notificationDao.findAllNotifications(req.user.id);
    return okResponse(notifications.reverse());
  };

  getNotificationCount = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<number>> => {
    const count = await this.notificationDao.countNotifications(req.user.id);
    return okResponse(count);
  };

  /**
   * Processes of updating a notification to mark it as read by calling the dao with the notification id.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  markNotificationRead = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<INotification>> => {
    const nid = req.params.nid;
    const readNotification = await this.notificationDao.deleteNotification(nid);

    return noContentResponse();
  };
}
