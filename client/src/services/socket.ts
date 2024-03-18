import { io, Socket } from 'socket.io-client';
import { getLocalAuthToken } from '../util/tokenManagement';
import { urlConfig } from '../config/appConfig';

const SERVER_URL = urlConfig.serverURL;
// Create a single socket instance
const socket: Socket = io(`${SERVER_URL}`, {
  query: { token: getLocalAuthToken() },
  transports: ['polling'],
  reconnection: true,
});

// Export the socket instance directly
export default socket;
