export interface IAlert {
  message: string;
  code?: number | string | undefined;
}
export interface IGlobalError {
  message: string;
  code?: number | string | undefined;
}

// Friendly error message class based on IAlert that only contains a message
export class FriendlyError extends Error implements IGlobalError {
  code?: number | string | undefined;
  constructor(message?: string, code?: number) {
    if (message === undefined) {
      super('Sorry! Something went wrong.');
    } else {
      super(message);
    }
  }
}
