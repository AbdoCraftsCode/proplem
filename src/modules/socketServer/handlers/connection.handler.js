import {
  connectedUsers,
  userGroupActivity,
  getIO,
  removeUserActivity,
  markGroupForDeletion,
} from "../socketIndex.js";

export const handleDisconnection = (socket, reason) => {
  console.log(
    `User disconnected: ${socket.user?.username} (${socket.id}) - Reason: ${reason}`
  );

  const io = getIO();

  checkAndUpdateGroupActivity(socket, io);

  if (socket.user?._id) {
    const userSockets = connectedUsers.get(socket.user._id);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        connectedUsers.delete(socket.user._id);
      }
    }
  }
};

const checkAndUpdateGroupActivity = (socket, io) => {
  try {
    const userGroups = new Set();

    const activity = userGroupActivity.get(socket.id);
    if (activity) {
      userGroups.add(activity.groupId);
    }

    if (socket.rooms) {
      socket.rooms.forEach((room) => {
        if (room.startsWith("group-")) {
          const groupId = room.replace("group-", "");
          userGroups.add(groupId);
        }
      });
    }

    userGroups.forEach((groupId) => {
      const room = io.sockets.adapter.rooms.get(`group-${groupId}`);

      if (!room || room.size === 0) {
        markGroupForDeletion(groupId);
        console.log(
          `Group ${groupId} marked for deletion (last user disconnected)`
        );
      }
    });
  } catch (error) {
    console.error("Error checking group activity on disconnect:", error);
  }
};

export const handleError = (socket, error) => {
  console.error(`Socket error for user ${socket.user?.username}:`, error);
};
