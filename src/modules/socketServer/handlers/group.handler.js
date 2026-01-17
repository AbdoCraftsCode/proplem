import { groupCounters } from "../socketIndex.js";
import { updateGroupCounters } from "../utils/socket.helper.js";
import { GroupModel } from "../../../DB/models/group.model.js";
import {
  updateGroupActivity,
  markGroupForDeletion,
  trackUserActivity,
  updateUserLastActive,
  updateFlag,
} from "../socketIndex.js";

import {checkUserName} from "../utils/checkUsername.js"

export const handleJoinGroup = async (io, socket, data) => {
  try {
    const { groupId } = data;

    if (!checkUserName(socket.user)) {
      socket.emit("join-group-error", {
        success: false,
        message: "user expired",
      });
      return;
    }

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

    trackUserActivity(socket.id, socket.user._id, groupId, userRole, true);

    ////////////////
    updateGroupCounters(groupId, userRole, "join");
    io.emit("group-counters-updated", {
      groupId: group._id,
      activeUsers: groupCounters.get(groupId).active || 0,
      guests: groupCounters.get(groupId).guests || 0,
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
  try {
    const {groupId} = data;

    

    socket.leave(`group-${groupId}`);

    socket.to(`group-${groupId}`).emit("user-leaved-group", {
      userId: socket.user._id,
      username: socket.user.username,
      timestamp: new Date(),
    });

    const group = await GroupModel.findById(groupId);
    const userRole = group.getUserRole(socket.user._id);
    updateFlag(socket.id)
    ////////////////
    updateGroupCounters(groupId, userRole, "leave");
    io.emit("group-counters-updated", {
      groupId: group._id,
      activeUsers: groupCounters.get(groupId).active || 0,
      guests: groupCounters.get(groupId).guests || 0,
    });
    /////////////////////
    
    console.log(`User ${socket.user.username} left group ${groupId}`);


    const room = io.sockets.adapter.rooms.get(`group-${groupId}`);
    if (!room || room.size === 0) {
      markGroupForDeletion(groupId);
      console.log(`Group ${groupId} marked for deletion (last user left)`);
    }

    socket.emit("group-left", {
      success: true,
      groupId,
    });
  } catch (error) {
    console.error("Error leaving group:", error);
    socket.emit("leave-group-error", {
      success: false,
      message: "Failed to leave group",
      error: error.message,
    });
  }
};

export const handleTyping = (io, socket, data) => {
  try {
    const { groupId, isTyping } = data;

    updateUserLastActive(socket.id, groupId);

    socket.to(`group-${groupId}`).emit("user-typing", {
      userId: socket.user._id,
      username: socket.user.username,
      isTyping,
      groupId,
    });
  } catch (error) {
    console.error("Error in handle typing :", error);
    socket.emit("typing-error", {
      success: false,
      message: "typing error",
      error: error.message,
    });
  }
};
