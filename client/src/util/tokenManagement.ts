const TOKEN_KEY = 'token';

export const setLocalAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearLocalAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getLocalAuthToken = () => localStorage.getItem(TOKEN_KEY);
