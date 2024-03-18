import io, { Socket } from 'socket.io-client';
import { urlConfig } from '../config/appConfig';
import store, { AppDispatch } from '../redux/store';
import { upsertNotification } from '../redux/notificationSlice';
import { addPost, removePost, updatePosts } from '../redux/postSlice';
import { INotification } from '../interfaces/INotification';
import { IPost } from '../interfaces/IPost';
import { IMessage } from '../interfaces/IMessage';

const SOCKET_URL = urlConfig.serverURL;

let socket: Socket;
let listening: boolean = false;

const handleSocketEvent = (
  eventName: string,
  payload: string | IPost | INotification | IMessage,
  dispatch: AppDispatch
) => {
  console.log('socket event received', eventName, payload);
  switch (eventName) {
    case 'NEW_NOTIFICATION':
      dispatch(upsertNotification(payload as INotification));
      break;
    case 'NEW_POST':
      dispatch(addPost(payload as IPost));
      break;
    case 'UPDATED_POST':
      dispatch(updatePosts(payload as IPost));
      break;
    case 'DELETED_POST':
      dispatch(removePost(payload as string));
      break;
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
    for (const eventName of [
      'NEW_NOTIFICATION',
      'NEW_POST',
      'UPDATED_POST',
      'DELETED_POST',
    ]) {
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
  for (const eventName of [
    'NEW_NOTIFICATION',
    'NEW_POST',
    'UPDATED_POST',
    'DELETED_POST',
  ]) {
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
