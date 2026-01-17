import {
  connectedUsers,
  userGroupActivity,
  getIO,
  markGroupForDeletion,
} from "../socketIndex.js";

import { groupCounters } from "../socketIndex.js";
import { updateGroupCounters } from "../utils/socket.helper.js";
import { GroupModel } from "../../../DB/models/group.model.js";

export const handleDisconnection = async (socket, reason) => {
  try {
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
  } catch (error) {
    console.error("Error handle disconnection:", error);
  }
};

const checkAndUpdateGroupActivity = async (socket, io, userId) => {
  try {
    const sessions = userGroupActivity.get(socket.id);
    if (!sessions || sessions.size === 0) {
      return;
    }

    let lastGroupId = null;
    let lastActivity = null;

    for (const [groupId, activity] of sessions.entries()) {
      if (activity.flag === true) {
        lastGroupId = groupId;
        lastActivity = activity;
        break;
      }
    }

    if (!lastGroupId) {
      console.log(`No last group found for disconnecting socket ${socket.id}`);
      return;
    }

    console.log(
      `Disconnecting user ${socket.user?.username} from last group: ${lastGroupId}`
    );

    const group = await GroupModel.findById(lastGroupId);
    if (!group) {
      console.log(`Group ${lastGroupId} not found during disconnect cleanup`);
      return;
    }

    const userRole = group.getUserRole(userId);

    updateGroupCounters(lastGroupId, userRole, "leave");

    io.emit("group-counters-updated", {
      groupId: lastGroupId,
      activeUsers: groupCounters.get(lastGroupId)?.active || 0,
      guests: groupCounters.get(lastGroupId)?.guests || 0,
    });

    const room = io.sockets.adapter.rooms.get(`group-${lastGroupId}`);
    if (!room || room.size === 0) {
      markGroupForDeletion(lastGroupId);
      console.log(
        `Group ${lastGroupId} marked for deletion (last user disconnected)`
      );
    }
  } catch (error) {
    console.error("Error checking group activity on disconnect:", error);
  }
};
