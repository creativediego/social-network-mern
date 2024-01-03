export const urlConfig = {
  baseURL: process.env.REACT_APP_BASE_URL,
  serverURL: process.env.REACT_APP_SERVER_URL,
  apiURL: `${process.env.REACT_APP_SERVER_URL}/api`,
  authApi: `${process.env.REACT_APP_SERVER_URL}/api/auth`,
  postApi: `${process.env.REACT_APP_SERVER_URL}/api/posts`,
  userApi: `${process.env.REACT_APP_SERVER_URL}/api/users`,
  likeApi: `${process.env.REACT_APP_SERVER_URL}/api/posts/likes`,
  dislikeApi: `${process.env.REACT_APP_SERVER_URL}/api/posts/dislikes`,
  chatApi: `${process.env.REACT_APP_SERVER_URL}/api/chat`,
  notificationApi: `${process.env.REACT_APP_SERVER_URL}/api/notifications`,
};
