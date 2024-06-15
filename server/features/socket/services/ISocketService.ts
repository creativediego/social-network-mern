import { Socket } from 'socket.io';
import { SocketEvents } from './SocketEvents';

/**
 * Handles the business logic for the socket feature.
 */
export interface ISocketService {
  handleOnConnect(socket: Socket): void;
  handleOnDisconnect(socket: Socket): void;
  emitToUser(room: string, type: SocketEvents, payload: any): void;
  emitToAllUsers(type: SocketEvents, payload: any): void;
}
