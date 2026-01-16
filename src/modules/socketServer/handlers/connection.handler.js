import {
  connectedUsers,
  userGroupActivity,
  getIO,
  removeUserActivity,
  markGroupForDeletion,
} from "../socketIndex.js";

import { groupCounters } from "../socketIndex.js";
import { updateGroupCounters } from "../utils/socket.helper.js";
import { GroupModel } from "../../../DB/models/group.model.js";

export const handleDisconnection = async (socket, reason) => {
  console.log(
    `User disconnected: ${socket.user?.username} (${socket.id}) - Reason: ${reason}`
  );

  const io = getIO();

  await checkAndUpdateGroupActivity(socket, io, socket.user._id);

  if (socket.user?._id) {
    const userSockets = connectedUsers.get(socket.user._id);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        connectedUsers.delete(socket.user._id);
      }
    }
  }

  userGroupActivity.delete(socket.id); // FIX: Added to clean up activity tracking on full disconnect
};

const checkAndUpdateGroupActivity = async (socket, io, userId) => {
  try {
    const userGroups = new Set();

    const sessions = userGroupActivity.get(socket.id);

    if (sessions) {
      for (const groupId of sessions.keys()) {
        userGroups.add(groupId);
      }
    }

    if (socket.rooms) {
      socket.rooms.forEach((room) => {
        if (room.startsWith("group-")) {
          const groupId = room.replace("group-", "");
          userGroups.add(groupId);
        }
      });
    }
    console.log(userGroups)

    for (const groupId of userGroups) { // FIX: Changed from forEach(async ...) to for...of for proper await handling
      const group = await GroupModel.findById(groupId);
      if (!group) return; // FIX: Added to skip if group not found
      const userRole = group.getUserRole(userId);
      // groupId = groupId.toString(); // FIX: Removed unnecessary reassignment

      ////////////////
      updateGroupCounters(groupId, userRole, "leave");
      io.emit("group-counters-updated", {
        groupId,
        activeUsers: groupCounters.get(groupId).active,
        guests: groupCounters.get(groupId).guests,
      });

      /////////////////////
      const room = io.sockets.adapter.rooms.get(`group-${groupId}`);

      if (!room || room.size === 0) {
        markGroupForDeletion(groupId);
        console.log(
          `Group ${groupId} marked for deletion (last user disconnected)`
        );
      }
    }
  } catch (error) {
    console.error("Error checking group activity on disconnect:", error);
  }
};

export const handleError = (socket, error) => {
  console.error(`Socket error for user ${socket.user?.username}:`, error);
};