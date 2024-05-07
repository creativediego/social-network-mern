export const urlConfig = {
  baseURL: import.meta.env.VITE_BASE_URL,
  serverURL: import.meta.env.VITE_SERVER_URL,
  apiURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  authApi: `${import.meta.env.VITE_SERVER_URL}/api/auth`,
  postApi: `${import.meta.env.VITE_SERVER_URL}/api/posts`,
  userApi: `${import.meta.env.VITE_SERVER_URL}/api/users`,
  likeApi: `${import.meta.env.VITE_SERVER_URL}/api/posts/likes`,
  dislikeApi: `${import.meta.env.VITE_SERVER_URL}/api/posts/dislikes`,
  chatApi: `${import.meta.env.VITE_SERVER_URL}/api/chats`,
  notificationApi: `${import.meta.env.VITE_SERVER_URL}/api/notifications`,
};
