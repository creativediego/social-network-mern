import { IUser } from '../../../features/user/models/IUser';
import { IHttpRequest } from '../../interfaces/IHttpRequest';
import { IHttpResponse } from '../../interfaces/IHttpResponse';
/**
 * Interface for auth controller.
 */
export default interface IAuthController {
  login(req: IHttpRequest): Promise<IHttpResponse<IUser>>;
  register(req: IHttpRequest): Promise<IHttpResponse<IUser>>;
}
