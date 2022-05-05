import io from 'socket.io-client';
import {
  findInboxMessagesThunk,
  findMessagesByConversationThunk,
} from '../redux/messageThunks';
import axios from 'axios';
import { processError } from './helpers';
import { updateChat } from '../redux/messageSlice';
import { updateNotifications } from '../redux/notificationSlice';
import { findAllTuitsThunk } from '../redux/tuitSlice';
const SECURITY_API = `${process.env.REACT_APP_API_URL}/auth`;

const api = axios.create();

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const CLIENT_URL = process.env.CLIENT_URL;

let socket;
let listening = false;

const listenForNewMessages = (socket, ThunkAPI) => {
  socket.on('NEW_MESSAGE', (message) => {
    ThunkAPI.dispatch(updateChat(message));
    ThunkAPI.dispatch(findInboxMessagesThunk());
  });
};

const listenForNewNotifications = (socket, ThunkAPI) => {
  socket.on('NEW_NOTIFICATION', (notification) => {
    ThunkAPI.dispatch(updateNotifications(notification));
  });
};

const listenForNewTuits = (socket, ThunkAPI) => {
  socket.on('NEW_TUIT', (tuit) => {
    ThunkAPI.dispatch(findAllTuitsThunk());
  });
};

const listeners = ['NEW_MESSAGE', 'NEW_NOTIFICATION', 'NEW_TUIT'];

export const enableListeners = (ThunkAPI) => {
  socket = io(`${SOCKET_URL}`, {
    cors: {
      origin: CLIENT_URL,
    },
    query: { token: localStorage.getItem('token') },
    transports: ['polling'],
    // reconnection: false,
  });
  if (listening) {
    return;
  }
  socket.on('connect', () => {
    listenForNewMessages(socket, ThunkAPI);
    listenForNewNotifications(socket, ThunkAPI);
    listenForNewTuits(socket, ThunkAPI);
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
