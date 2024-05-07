import { IBaseController } from '../../../common/interfaces/IBaseController';
import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import { IUser } from '../models/IUser';

export interface IUserController extends IBaseController<IUser> {
  findOne(req: IHttpRequest): Promise<IHttpResponse<IUser>>;
}
