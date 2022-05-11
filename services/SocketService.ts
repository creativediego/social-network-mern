import { Server as ioServer, Socket } from 'socket.io';
import { Server } from 'http';
import dotenv from 'dotenv';
import ISocketService from './ISocketService';
import IJWTService from './IJWTService';
import IDao from '../daos/shared/IDao';
import IUser from '../models/users/IUser';
dotenv.config();

export default class SocketService implements ISocketService {
  private readonly io: ioServer;
  private readonly userDao: IDao<IUser>;
  public constructor(
    jwtService: IJWTService,
    httpServer: Server,
    userDao: IDao<IUser>
  ) {
    this.userDao = userDao;
    this.io = new ioServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL!,
        credentials: true,
      },
    });
    this.io
      .use(async (socket: any, next) => {
        if (!socket.handshake.query || !socket.handshake.query.token) {
          return;
        }
        try {
          const decodedToken = await jwtService.verifyToken(
            socket.handshake.query.token
          );
          if (!decodedToken) {
            // null or undefined token; i.e. no token present
            return;
          } else {
            const existingUser = await userDao.findByField(decodedToken.email);
            socket.user = existingUser;
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
