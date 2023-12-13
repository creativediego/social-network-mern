import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
/**
 * Interface for auth controller.
 */
export default interface IAuthController {
  login(req: HttpRequest): Promise<HttpResponse>;
  register(req: HttpRequest): Promise<HttpResponse>;
}
