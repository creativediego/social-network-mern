import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import { processError } from './helpers';
import { updateNotifications } from '../redux/notificationSlice';
import { addTuit, updateTuits } from '../redux/tuitSlice';
import { updateInbox } from '../redux/messageInboxSlice';
import { upsertChatMessage } from '../redux/chatSlice';
import { IMessage } from '../interfaces/IMessage';
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
    ThunkAPI.dispatch(updateInbox(newMessage));
    ThunkAPI.dispatch(upsertChatMessage(newMessage));
  });
};

const listenForNewNotifications = (socket: Socket, ThunkAPI: any) => {
  socket.on('NEW_NOTIFICATION', (notification) => {
    ThunkAPI.dispatch(updateNotifications(notification));
  });
};

const listenForNewTuits = (socket: Socket, ThunkAPI: any) => {
  socket.on('NEW_TUIT', (tuit) => {
    ThunkAPI.dispatch(addTuit(tuit));
  });
};

const listenForUpdatedTuits = (socket: Socket, ThunkAPI: any) => {
  socket.on('UPDATED_TUIT', (tuit) => {
    ThunkAPI.dispatch(updateTuits(tuit));
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
    listenForNewTuits(socket, ThunkAPI);
    listenForUpdatedTuits(socket, ThunkAPI);
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
