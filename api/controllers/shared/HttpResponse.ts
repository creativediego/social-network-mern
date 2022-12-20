import { Http2ServerResponse } from 'http2';
import { StatusCode } from './HttpStatusCode';

interface HttpResponse {
  code: StatusCode;
  body?: any;
  error?: any;
}

export default HttpResponse;
