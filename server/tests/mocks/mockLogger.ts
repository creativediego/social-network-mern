import { ILogger } from '../../common/logger/ILogger';

export const mockLogger: ILogger = {
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
};
