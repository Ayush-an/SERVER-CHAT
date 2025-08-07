//server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import { setupWebSocket } from './websocket/socket.js';

dotenv.config();

// DB connection (either here or via connectDB())
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("DB error:", err));

// Express app & server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/auth', adminAuthRoutes);

// WebSocket setup
setupWebSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));