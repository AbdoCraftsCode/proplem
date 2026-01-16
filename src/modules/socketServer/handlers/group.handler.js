// socketServer/handlers/group.handler.js
import { GroupModel } from "../../../DB/models/group.model.js";
import {
  updateGroupActivity,
  markGroupForDeletion,
  trackUserActivity,
  updateUserLastActive,
  removeUserActivity,
  activeGroups,
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

    if (group.isMember(socket.user._id)) {
      trackUserActivity(socket.id, socket.user._id, groupId);
    }

    const userRole = group.getUserRole(socket.user._id);

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

export const handleLeaveGroup = (io, socket, data) => {
  const groupId = data;

  socket.to(`group-${groupId}`).emit("user-leaved-group", {
    userId: socket.user._id,
    username: socket.user.username,
    timestamp: new Date(),
  });

  socket.leave(`group-${groupId}`);

  console.log(`User ${socket.user.username} left group ${groupId}`);

  // FEATURE 1: Check if this was the last user in the group
  const room = io.sockets.adapter.rooms.get(`group-${groupId}`);
  if (!room || room.size === 0) {
    markGroupForDeletion(groupId);
    console.log(`Group ${groupId} marked for deletion (last user left)`);
  }

  socket.emit("group-left", {
    success: true,
    groupId,
  });
};

export const handleTyping = (io, socket, data) => {
  const { groupId, isTyping } = data;

  updateUserLastActive(socket.id);

  socket.to(`group-${groupId}`).emit("user-typing", {
    userId: socket.user._id,
    username: socket.user.username,
    isTyping,
    groupId,
  });
};
