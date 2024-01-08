import { Server as ioServer, Socket } from 'socket.io';
import { Server } from 'http';
import dotenv from 'dotenv';
import { ISocketService } from './ISocketService';
import { IJWTService } from './IJWTService';
import IBaseDao from '../daos/shared/IDao';
import IUser from '../models/users/IUser';

dotenv.config();

export default class SocketService implements ISocketService {
  private readonly io: ioServer; // Instance of the Socket.IO server
  private readonly userDao: IBaseDao<IUser>; // User data access object

  public constructor(
    jwtService: IJWTService, // Service for handling JSON Web Tokens
    httpServer: Server, // HTTP server instance
    userDao: IBaseDao<IUser> // Data Access Object for user data
  ) {
    this.userDao = userDao;

    // Initializing Socket.IO server with provided HTTP server instance
    this.io = new ioServer(httpServer, {
      cors: {
        origin: process.env.API_CLIENT_URL!, // Configuring CORS for client URL
        credentials: true,
        methods: ['GET', 'POST'],
      },
    });

    // Middleware for socket connections
    this.io
      .use(async (socket: any, next) => {
        // Authenticating connections based on token provided in the query parameters
        if (!socket.handshake.query || !socket.handshake.query.token) {
          return;
        }
        try {
          const decodedToken = await jwtService.verifyToken(
            socket.handshake.query.token
          );
          if (!decodedToken) {
            // If token is invalid or missing, return without authentication
            return;
          } else {
            // Valid token: Fetch user from DAO using the token's email
            const existingUser = await userDao.findByField(decodedToken.email);
            socket.user = existingUser; // Attach user data to the socket for reference
            return next(); // Continue with connection
          }
        } catch (err) {
          return next(); // If error occurs during token verification, proceed without authentication
        }
      })

      // Event listener for new socket connections
      .on('connection', (socket: any) => {
        // When a connection is authenticated, handle connection events
        if (!socket.user) return; // If socket doesn't have user data, skip handling
        this.handleOnConnect(socket); // Handle socket connection events
        this.handleOnDisconnect(socket); // Handle socket disconnection events
      });

    Object.freeze(this); // Freeze the SocketService instance to prevent modifications
  }

  // Method to handle actions upon socket connection
  handleOnConnect = (socket: any): void => {
    console.log(
      `Socket connected to user: ${socket.user.username}. Socket id: ${socket.id}`
    );
    const socketWithUser: any = socket;
    socket.join(socketWithUser.user.id); // Join a room to emit events privately to the user
  };

  // Method to handle actions upon socket disconnection
  handleOnDisconnect = (socket: any): void => {
    socket.on('disconnect', (reason: any) => {
      console.log(
        `User ${socket.user.username} disconnected from socket ${socket.id}. Reason: ${reason}.`
      );
    });
  };

  // Method to emit events to a specific room
  emitToRoom = (room: string, type: string, payload: any): void => {
    this.io.to(room).emit(type, payload);
  };

  // Method to emit events to all connected sockets
  emitToAll = (type: string, payload: any): void => {
    this.io.emit(type, payload);
  };
}
