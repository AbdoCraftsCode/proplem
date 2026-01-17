import { groupCounters } from "../socketIndex.js";
import { updateGroupCounters } from "../utils/socket.helper.js";
import { GroupModel } from "../../../DB/models/group.model.js";
import {
  updateGroupActivity,
  markGroupForDeletion,
  trackUserActivity,
  updateUserLastActive,
  removeUserActivity,
} from "../socketIndex.js";

export const handleJoinGroup = async (io, socket, data) => {
  try {
    const { groupId } = data;

    console.log(
      `User ${socket.user.username} attempting to join group ${groupId}`
    );

    const group = await GroupModel.findById(groupId);
    if (!group) {
      socket.emit("join-group-error", {
        success: false,
        message: "Group not found",
      });
      return;
    }

    updateGroupActivity(groupId);

    socket.join(`group-${groupId}`);

    const userRole = group.getUserRole(socket.user._id);

    trackUserActivity(
      socket.id,
      socket.user._id,
      groupId,
      userRole,
      true
    );

    ////////////////
    updateGroupCounters(groupId, userRole, "join");
    io.emit("group-counters-updated", {
      groupId: group._id,
      activeUsers: groupCounters.get(groupId).active,
      guests: groupCounters.get(groupId).guests,
    });
    /////////////////////
    console.log(groupCounters);

    socket.emit("group-joined", {
      success: true,
      groupId,
      groupName: group.name,
      userRole,
      activeUsersCount: group.activeUsers.length,
      canSendMessages: userRole === "admin" || userRole === "active",
    });

    socket.to(`group-${groupId}`).emit("user-joined-group", {
      userId: socket.user._id,
      username: socket.user.username,
      userRole,
      timestamp: new Date(),
    });

    console.log(
      `User ${socket.user.username} successfully joined group ${groupId} as ${userRole}`
    );
  } catch (error) {
    console.error("Error joining group:", error);
    socket.emit("join-group-error", {
      success: false,
      message: "Failed to join group",
      error: error.message,
    });
  }
};

export const handleLeaveGroup = async (io, socket, data) => {
  const groupId = data;

  socket.to(`group-${groupId}`).emit("user-leaved-group", {
    userId: socket.user._id,
    username: socket.user.username,
    timestamp: new Date(),
  });

  socket.leave(`group-${groupId}`);

  const group = await GroupModel.findById(groupId);
  const userRole = group.getUserRole(socket.user._id);

  ////////////////
  updateGroupCounters(groupId, userRole, "leave");
  io.emit("group-counters-updated", {
    groupId: group._id,
    activeUsers: groupCounters.get(group._id).active,
    guests: groupCounters.get(group._id).guests,
  });
  /////////////////////

  console.log(`User ${socket.user.username} left group ${groupId}`);

  // FEATURE 1: Check if this was the last user in the group
  const room = io.sockets.adapter.rooms.get(`group-${groupId}`);
  if (!room || room.size === 0) {
    markGroupForDeletion(groupId);
    console.log(`Group ${groupId} marked for deletion (last user left)`);
  }

  removeUserActivity(socket.id, groupId); // FIX: Added for per-group cleanup on explicit leave

  socket.emit("group-left", {
    success: true,
    groupId,
  });
};

export const handleTyping = (io, socket, data) => {
  const { groupId, isTyping } = data;

  updateUserLastActive(socket.id, groupId);

  socket.to(`group-${groupId}`).emit("user-typing", {
    userId: socket.user._id,
    username: socket.user.username,
    isTyping,
    groupId,
  });
};
