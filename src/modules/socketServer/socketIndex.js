// socketServer/index.js
import { Server } from "socket.io";
import { authMiddleware } from "./middlewares/authSocket.middleware.js";
import { setupConnectionEvents } from "./events/connection.events.js";
import { setupGroupEvents } from "./events/group.events.js";
import { setupMessageEvents } from "./events/message.events.js";
import { startCleanupIntervals } from "./utils/groupCleanup.js";

let io;

export const connectedUsers = new Map();

export const groupLastActivity = new Map(); // groupId -> { lastUserLeft: Date }

export const userGroupActivity = new Map(); // socketId -> { userId, groupId, lastActive: Date }

export const activeGroups = new Set(); // Set of groupIds that have active users

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: false,
    },
    connectionStateRecovery: {
      maxDisconnectionDuration:  60 * 1000,
    },
  });

  io.use(authMiddleware);

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.id})`);

    setupConnectionEvents(io, socket);
    setupGroupEvents(io, socket);
    setupMessageEvents(io, socket);
  });

  // Pass the io instance to cleanup
  startCleanupIntervals(io);

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const getUserSockets = (userId) => {
  const sockets = connectedUsers.get(userId);
  return sockets ? Array.from(sockets) : [];
};

export const updateGroupActivity = (groupId) => {
  groupLastActivity.delete(groupId);
  activeGroups.add(groupId);
};

export const markGroupForDeletion = (groupId) => {
  groupLastActivity.set(groupId, {
    lastUserLeft: new Date(),
    deletionScheduled: new Date(Date.now() + 1 * 60 * 1000),
  });
  activeGroups.delete(groupId);
};

export const trackUserActivity = (socketId, userId, groupId) => {
  userGroupActivity.set(socketId, {
    userId,
    groupId,
    lastActive: new Date(),
    lastMessageSent: new Date(),
  });
};

export const updateUserLastActive = (socketId) => {
  const activity = userGroupActivity.get(socketId);
  if (activity) {
    activity.lastActive = new Date();
  }
};

export const updateUserLastMessage = (socketId) => {
  const activity = userGroupActivity.get(socketId);
  if (activity) {
    activity.lastMessageSent = new Date();
    activity.lastActive = new Date();
  }
};

export const removeUserActivity = (socketId) => {
  userGroupActivity.delete(socketId);
};
