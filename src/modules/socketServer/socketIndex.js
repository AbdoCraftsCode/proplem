// socketServer/index.js
// (No changes needed here)
import { Server } from "socket.io";
import { authMiddleware } from "./middlewares/authSocket.middleware.js";
import { setupConnectionEvents } from "./events/connection.events.js";
import { setupGroupEvents } from "./events/group.events.js";
import { setupMessageEvents } from "./events/message.events.js";
import { startCleanupIntervals } from "./utils/groupCleanup.js";
let io;
export const connectedUsers = new Map();
export const groupCounters = new Map();
export const groupLastActivity = new Map(); // groupId -> { lastUserLeft: Date }
export const userGroupActivity = new Map(); // socketId -> { userId, groupId, lastActive: Date }
export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: false,
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 60 * 1000,
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
};
export const markGroupForDeletion = (groupId) => {
  groupLastActivity.set(groupId, {
    lastUserLeft: new Date(),
    deletionScheduled: new Date(Date.now() + 60 * 60 * 1000),
  });
};
export const trackUserActivity = (
  socketId,
  userId,
  groupId,
  userRole,
  flag = true
) => {
  if (!userGroupActivity.has(socketId)) {
    userGroupActivity.set(socketId, new Map());
  }

  const userSessions = userGroupActivity.get(socketId);

  for (const [existingGroupId, activity] of userSessions.entries()) {
    activity.flag = false;
  }

  userSessions.set(groupId, {
    userId,
    groupId,
    userRole,
    lastActive: new Date(),
    lastMessageSent: new Date(),
    flag,
  });
};

export const updateFlag = (socketId) => {
  if (!userGroupActivity.has(socketId)) return;

  const userSessions = userGroupActivity.get(socketId);

  for (const activity of userSessions.values()) {
    activity.flag = false;
  }
};
export const updateUserLastActive = (socketId, groupId) => {
  const sessions = userGroupActivity.get(socketId);
  if (!sessions) return;
  const activity = sessions.get(groupId);
  if (!activity) return;
  activity.lastActive = new Date();
};
export const updateUserLastMessage = (socketId, groupId) => {
  const sessions = userGroupActivity.get(socketId);
  if (!sessions) return;
  const session = sessions.get(groupId);
  if (!session) return;
  session.lastMessageSent = new Date();
  session.lastActive = new Date();
};
export const removeUserActivity = (socketId, groupId) => {
  const sessions = userGroupActivity.get(socketId);
  if (!sessions) return;
  sessions.delete(groupId);
  if (sessions.size === 0) {
    userGroupActivity.delete(socketId);
  }
};
