import { createServer } from 'http';
import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt';

export const createSocketServer = (httpServer: ReturnType<typeof createServer>) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL, credentials: true },
    pingTimeout: 60000
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  return io;
};
