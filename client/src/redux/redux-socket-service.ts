import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import { processError } from '../services/helpers';
import { upsertNotification } from './notificationSlice';
import { addPost, updatePosts } from './postSlice';
import { findInboxMessagesThunk } from './messageInboxSlice';
import { upsertChatMessage } from './chatSlice';
import { IMessage } from '../interfaces/IMessage';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

/**
 * Redux and socket io helpers for firing off redux state changes on certain socket actions. Helpers are called from inside CreateAsyncThunk slices.
 */

const SECURITY_API = `${process.env.REACT_APP_API_URL}/auth`;
const api = axios.create();
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

let socket: any;
let listening = false;

const listenForNewMessages = (
  socket: Socket,
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  socket.on('NEW_MESSAGE', (message: IMessage) => {
    dispatchAction(findInboxMessagesThunk());
    dispatchAction(upsertChatMessage(message));
  });
};

const listenForNewNotifications = (
  socket: Socket,
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  socket.on('NEW_NOTIFICATION', (notification) => {
    dispatchAction(upsertNotification(notification));
  });
};

const listenForNewPosts = (
  socket: Socket,
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  socket.on('NEW_POST', (post) => {
    dispatchAction(addPost(post));
  });
};

const listenForUpdatedPosts = (
  socket: Socket,
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  socket.on('UPDATED_POST', (post) => {
    dispatchAction(updatePosts(post));
  });
};

const listeners = ['NEW_MESSAGE', 'NEW_NOTIFICATION', 'NEW_POST'];

export const enableListeners = (
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  if (listening) {
    return;
  }
  socket = io(`${SOCKET_URL}`, {
    // cors: {
    //   origin: CLIENT_URL,
    // },
    query: { token: localStorage.getItem('token') },
    transports: ['polling'],
    reconnection: true,
  });
  socket.once('connect', () => {
    listenForNewMessages(socket, dispatchAction);
    listenForNewNotifications(socket, dispatchAction);
    listenForNewPosts(socket, dispatchAction);
    listenForUpdatedPosts(socket, dispatchAction);
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
