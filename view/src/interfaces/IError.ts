export interface IError {
  message: string;
  code?: number | string | undefined;
}
export interface ResponseError {
  error: IError;
}
