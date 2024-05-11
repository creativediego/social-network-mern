import io, { Socket } from 'socket.io-client';
import { urlConfig } from '../config/appConfig';
import store, { AppDispatch } from '../redux/store';
import {
  deleteNotification,
  addNotification,
} from '../redux/notificationSlice';
import { addPost, removePost, updatePosts } from '../redux/postSlice';
import { INotification } from '../interfaces/INotification';
import { IPost } from '../interfaces/IPost';
import { IMessage } from '../interfaces/IMessage';
import { markMessageReadThunk, upsertChatMessage } from '../redux/chatSlice';
import { addInboxMessage } from '../redux/inboxSlice';

const SOCKET_URL = urlConfig.serverURL;

let socket: Socket;
let listening: boolean = false;
const SOCKET_EVENTS = [
  'NEW_NOTIFICATION',
  'DELETE_NOTIFICATION',
  'NEW_POST',
  'NEW_MESSAGE',
  'UPDATE_POST',
  'DELETE_POST',
];

const handleSocketEvent = (
  eventName: string,
  payload: string | IPost | INotification | IMessage,
  dispatch: AppDispatch
) => {
  switch (eventName) {
    case 'NEW_NOTIFICATION':
      dispatch(addNotification(payload as INotification));
      break;
    case 'DELETE_NOTIFICATION':
      dispatch(deleteNotification(payload as INotification));
      break;
    case 'NEW_POST':
      dispatch(addPost(payload as IPost));
      break;
    case 'UPDATE_POST':
      dispatch(updatePosts(payload as IPost));
      break;
    case 'DELETE_POST':
      dispatch(removePost(payload as string));
      break;

    case 'NEW_MESSAGE':
      const message = payload as IMessage;
      dispatch(upsertChatMessage(message));
      dispatch(addInboxMessage(message));
      dispatch(markMessageReadThunk(message));

    // Add more cases for other socket events as needed
  }
};

export const enableSocketListeners = () => {
  if (listening) {
    return;
  }

  socket = io(`${SOCKET_URL}`, {
    query: { token: localStorage.getItem('token') },
    transports: ['polling'],
    reconnection: true,
  });

  socket.once('connect', () => {
    for (const eventName of SOCKET_EVENTS) {
      socket.on(eventName, (payload) => {
        handleSocketEvent(eventName, payload, store.dispatch);
      });
    }

    // Add similar event listeners for other actions and slices as needed
    listening = true;
  });

  socket.on('disconnect', () => {
    disableListeners();
  });
};

const disableListeners = () => {
  for (const eventName of SOCKET_EVENTS) {
    socket.off(eventName);
  }

  // Remove listeners for other events and slices as needed
  listening = false;
};

export const disconnectSocket = () => {
  if (!socket) {
    return;
  }
  socket.disconnect();
  listening = false;
};
