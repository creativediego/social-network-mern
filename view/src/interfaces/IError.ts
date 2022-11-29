export interface IAlert {
  message: string;
  code?: number | string | undefined;
}
export interface ResponseError {
  error: IAlert;
}
