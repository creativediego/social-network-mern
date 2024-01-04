import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import { upsertNotification } from './notificationSlice';
import { addPost, removePost, updatePosts } from './postSlice';
import { findInboxMessages } from './inboxSlice';
import { upsertChatMessage } from './chatSlice';
import { IMessage } from '../interfaces/IMessage';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { IPost } from '../interfaces/IPost';
import { urlConfig } from '../config/appConfig';
import { Requests, callAPI } from '../util/apiConfig';
/**
 * Redux and socket io helpers for firing off redux state changes on certain socket actions. Helpers are called from inside CreateAsyncThunk slices.
 */

const SECURITY_API = `${urlConfig.authApi}`;
const api = axios.create();
const SOCKET_URL = urlConfig.serverURL;

let socket: any;
let listening = false;

const listenForNewMessages = (
  socket: Socket,
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  socket.on('NEW_MESSAGE', (message: IMessage) => {
    dispatchAction(findInboxMessages());
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
  socket.on('UPDATED_POST', (post: IPost) => {
    dispatchAction(updatePosts(post));
  });

  socket.on('DELETED_POST', (post: IPost) => {
    dispatchAction(removePost(post.id));
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
  // socket.once('connect', () => {
  //   // listenForNewMessages(socket, dispatchAction);
  //   // listenForNewNotifications(socket, dispatchAction);
  //   // listenForNewPosts(socket, dispatchAction);
  //   // listenForUpdatedPosts(socket, dispatchAction);
  //   listening = true;
  // });
  // socket.on('disconnect', () => {
  //   disableListeners();
  // });
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
  callAPI(
    `${SECURITY_API}/socket`,
    Requests.POST,
    undefined,
    'Error registering socket. Try again later.'
  );
