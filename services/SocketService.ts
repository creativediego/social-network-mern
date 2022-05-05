import { Server as ioServer, Socket } from 'socket.io';
import { Server } from 'http';
import JWTService from './JWTService';
import dotenv from 'dotenv';
import ISocketService from './ISocketService';
dotenv.config();

export default class SocketService implements ISocketService {
  private readonly io: ioServer;
  public constructor(jwtService: JWTService, httpServer: Server) {
    this.io = new ioServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL!,
        credentials: true,
      },
    });
    this.io
      .use((socket: any, next) => {
        if (!socket.handshake.query || !socket.handshake.query.token) {
          return;
        }
        try {
          const decodedToken = jwtService.verifyToken(
            socket.handshake.query.token
          );
          if (!decodedToken) {
            // null or undefined token; i.e. no token present
            return;
          } else {
            socket.user = decodedToken;
            return next();
          }
        } catch (err) {
          return next();
        }
      })
      .on('connection', (socket: any) => {
        // Connection now authenticated to receive further events
        if (!socket.user) return;
        this.handleOnConnect(socket);
        this.handleOnDisconnect(socket);
      });
    Object.freeze(this);
  }

  handleOnConnect = (socket: Socket): void => {
    console.log('connected to socket: ', socket.id);
    const socketWithUser: any = socket;
    socket.join(socketWithUser.user.id); // room to emit events privately to user
  };

  handleOnDisconnect = (socket: Socket): void => {
    socket.on('disconnect', (reason: any) => {
      console.log(`Socket ${socket.id} disconnected. Reason: ${reason}.`);
    });
  };

  emitToRoom = (room: string, type: string, payload: any): void => {
    this.io.to(room).emit(type, payload);
  };
  emitToAll = (type: string, payload: any): void => {
    this.io.emit(type, payload);
  };
}
