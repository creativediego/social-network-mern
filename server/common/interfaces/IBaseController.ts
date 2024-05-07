import { IHttpRequest } from './IHttpRequest';
import { IHttpResponse } from './IHttpResponse';

/**
 * Represents generic CRUD functionality of a controller.
 */
export interface IBaseController<T> {
  findAll(req: IHttpRequest): Promise<IHttpResponse<T[]>>;
  findById(req: IHttpRequest): Promise<IHttpResponse<T>>;
  create(req: IHttpRequest): Promise<IHttpResponse<T>>;
  update(req: IHttpRequest): Promise<IHttpResponse<T>>;
  delete(req: IHttpRequest): Promise<IHttpResponse<void>>;
}
