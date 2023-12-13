export interface IAlert {
  message: string;
  code?: number | string | undefined;
}
export interface IGlobalError {
  error: IAlert;
}

// Friendly error message class based on IAlert that only contains a message
export class FriendlyError implements IGlobalError {
  error: IAlert;
  constructor(message?: string, code?: number) {
    this.error = {
      message: message ? message : 'Sorry! Something went wrong.',
      code: code ? code : 500,
    };
  }
}
