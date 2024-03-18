export interface IServerError {
  status: 'error';
  timestamp: Date;
  code?: string;
  error: {
    message: string;
  };
  path: string;
}
