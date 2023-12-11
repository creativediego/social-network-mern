import { Socket } from 'socket.io';

export interface ISocketService {
  handleOnConnect(socket: Socket): void;
  handleOnDisconnect(socket: Socket): void;
  emitToRoom(room: string, type: string, payload: any): void;
  emitToAll(type: string, payload: any): void;
}
