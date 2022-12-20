import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import { processError } from './helpers';
import { upsertNotification } from '../redux/notificationSlice';
import { addPost, updatePosts } from '../redux/postSlice';
import {
  findInboxMessagesThunk,
  updateInbox,
} from '../redux/messageInboxSlice';
import { upsertChatMessage } from '../redux/chatSlice';
import { IMessage } from '../interfaces/IMessage';
import store from '../redux/store';
const SECURITY_API = `${process.env.REACT_APP_API_URL}/auth`;
const api = axios.create();
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

let socket: any;
let listening = false;

const listenForNewMessages = (socket: Socket, ThunkAPI: any) => {
  socket.on('NEW_MESSAGE', (message) => {
    const newMessage: IMessage = {
      ...message,
      conversationId: message.conversation.id,
    };
    ThunkAPI.dispatch(findInboxMessagesThunk());
    ThunkAPI.dispatch(upsertChatMessage(newMessage));
  });
};

const listenForNewNotifications = (socket: Socket, ThunkAPI: any) => {
  socket.on('NEW_NOTIFICATION', (notification) => {
    // ThunkAPI.dispatch(upsertNotification(notification));
    store.dispatch(upsertNotification(notification));
  });
};

const listenForNewPosts = (socket: Socket, ThunkAPI: any) => {
  socket.on('NEW_TUIT', (post) => {
    ThunkAPI.dispatch(addPost(post));
  });
};

const listenForUpdatedPosts = (socket: Socket, ThunkAPI: any) => {
  socket.on('UPDATED_TUIT', (post) => {
    ThunkAPI.dispatch(updatePosts(post));
  });
};

const listeners = ['NEW_MESSAGE', 'NEW_NOTIFICATION', 'NEW_TUIT'];

export const enableListeners = (ThunkAPI: any) => {
  if (listening) {
    return;
  }
  socket = io(`${SOCKET_URL}`, {
    // cors: {
    //   origin: CLIENT_URL,
    // },
    query: { token: localStorage.getItem('token') },
    transports: ['polling'],
    reconnection: false,
  });
  socket.once('connect', () => {
    listenForNewMessages(socket, ThunkAPI);
    listenForNewNotifications(socket, ThunkAPI);
    listenForNewPosts(socket, ThunkAPI);
    listenForUpdatedPosts(socket, ThunkAPI);
    listening = true;
  });
  socket.on('disconnect', () => {
    disableListeners();
  });
};

const disableListeners = () => {
  for (const listener of listeners) {
    socket.off(listener);
  }
  listening = false;
};

export const disconnect = () => {
  socket.disconnect();
  listening = false;
};

export const registerSocket = () =>
  api
    .get(`${SECURITY_API}/socket`)
    .then((response) => response.data)
    .catch((err) => processError(err));
