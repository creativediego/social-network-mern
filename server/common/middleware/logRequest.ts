import { IHttpRequest } from '../interfaces/IHttpRequest';
import { ILogger } from '../logger/ILogger';

export function logRequest(req: IHttpRequest, logger: ILogger): void {
  logger.info(
    `Received ${req.method} request for ${req.url} from user ${req.user}`
  );
}
