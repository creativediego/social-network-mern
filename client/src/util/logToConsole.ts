// Log error and optional param to console if env is development
export const logToConsole = (error: string, optionalParam?: any) => {
  if (import.meta.env.VITE_ENV === 'development') {
    console.log(error, optionalParam);
  }
};
