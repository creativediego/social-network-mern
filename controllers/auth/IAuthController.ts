import HttpResponse from '../shared/HttpResponse';
/**
 * Interface for auth controller.
 */
export default interface IAuthController {
  login(req: HttpResponse): Promise<HttpResponse>;
  register(req: HttpResponse): Promise<HttpResponse>;
  getProfile(req: HttpResponse): Promise<HttpResponse>;
}
