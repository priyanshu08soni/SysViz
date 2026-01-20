import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';
import designRoutes from './routes/designRoutes';
import teamRoutes from './routes/teamRoutes';
import activityRoutes from './routes/activityRoutes';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, specify the client URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/collaboration', teamRoutes);
app.use('/api/activity', activityRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SysViz Collaborative Backend is running' });
});

// Socket.IO Logic for Collaboration
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-workspace', (workspaceId) => {
    socket.join(workspaceId);
    console.log(`User ${socket.id} joined workspace ${workspaceId}`);
  });

  // Broadcast cursor movement
  socket.on('cursor-move', ({ workspaceId, userId, userName, position }) => {
    socket.to(workspaceId).emit('user-cursor-move', { userId, userName, position });
  });

  // Sync canvas changes
  socket.on('node-change', ({ workspaceId, changes }) => {
    socket.to(workspaceId).emit('nodes-sync', changes);
  });

  socket.on('edge-change', ({ workspaceId, changes }) => {
    socket.to(workspaceId).emit('edges-sync', changes);
  });

  socket.on('add-node', ({ workspaceId, node }) => {
    socket.to(workspaceId).emit('node-added', node);
  });

  // Chat / Discussion logic
  socket.on('send-message', ({ workspaceId, message }) => {
    io.to(workspaceId).emit('new-message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('user-disconnected', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Collaborative Server is running on port ${PORT}`);
});
