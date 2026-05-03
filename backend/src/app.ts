import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { createSocketServer } from './config/socket';
import { registerTaskSocketHandlers } from './sockets/task.socket';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import dashboardRoutes from './routes/dashboard';
import { errorHandler } from './middleware/errors';

const app = express();
const httpServer = createServer(app);

// Socket.io setup
export const io = createSocketServer(httpServer);
registerTaskSocketHandlers(io);

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes(io));
app.use('/api/v1/projects', taskRoutes(io));
app.use('/api/v1/dashboard', dashboardRoutes);

app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));

// Error Handler
app.use(errorHandler);

export default httpServer;