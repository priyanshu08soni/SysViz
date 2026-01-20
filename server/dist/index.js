"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const designRoutes_1 = __importDefault(require("./routes/designRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
dotenv.config();
// Connect to MongoDB
(0, db_1.default)();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*", // In production, specify the client URL
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/designs', designRoutes_1.default);
app.use('/api/collaboration', teamRoutes_1.default);
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
