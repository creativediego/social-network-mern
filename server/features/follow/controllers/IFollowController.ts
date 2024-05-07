import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import { IFollow } from '../models/IFollow';

/**
 * Common controller request, response operations for the follow resource.
 */
export default interface IFollowController {
  createFollow(req: IHttpRequest): Promise<IHttpResponse<number>>;
  acceptFollow(req: IHttpRequest): Promise<IHttpResponse<IFollow>>;
  deleteFollow(req: IHttpRequest): Promise<IHttpResponse<number>>;
  findFollow(req: IHttpRequest): Promise<IHttpResponse<boolean>>;
}
