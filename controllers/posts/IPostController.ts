import IGenericController from '../shared/IGenericController';

import HttpResponse from '../shared/HttpResponse';
import HttpRequest from '../shared/HttpRequest';

/**
 * Represents the interface functionality of a post controller to handle requests and responses for the post resource.
 */
export default interface IPostController extends IGenericController {
  findByUser(req: HttpRequest): Promise<HttpResponse>;
  findAllByKeyword(req: HttpRequest): Promise<HttpResponse>;
}
