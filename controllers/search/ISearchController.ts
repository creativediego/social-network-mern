import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';

export default interface ISearchController {
  findAll(req: HttpRequest): Promise<HttpResponse>;
  findAllPosts(req: HttpRequest): Promise<HttpResponse>;
  findAllUsers(req: HttpRequest): Promise<HttpResponse>;
}
