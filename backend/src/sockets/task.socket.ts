import { Server } from 'socket.io';

export const registerTaskSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user?.id}`);

    socket.on('join-project', (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`Socket ${socket.id} joined project:${projectId}`);
    });

    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user?.id}`);
    });
  });
};
