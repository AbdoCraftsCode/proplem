import { GroupModel } from "../../../DB/models/group.model.js";
import { groupLastActivity, userGroupActivity } from "../socketIndex.js";
import { groupCounters } from "../socketIndex.js";
import { updateGroupCounters } from "../utils/socket.helper.js";
import { removeUserActivity } from "../socketIndex.js"; // FIX: Added import for removeUserActivity

let cleanupIo = null;

const deleteInactiveGroups = async () => {
  if (!cleanupIo) {
    console.error("Cleanup: io instance not available");
    return;
  }

  try {
    const now = new Date();
    const groupsToDelete = [];

    for (const [groupId, activity] of groupLastActivity.entries()) {
      if (now >= activity.deletionScheduled) {
        groupsToDelete.push(groupId);
      }
    }

    for (const groupId of groupsToDelete) {
      try {
        const group = await GroupModel.findById(groupId);
        if (!group) {
          groupLastActivity.delete(groupId);
          continue;
        }

        // Collect all relevant user IDs (admin + active users) to notify
        const membersToNotify = new Set();
        membersToNotify.add(group.admin.toString());
        group.activeUsers.forEach((activeUser) => {
          membersToNotify.add(activeUser.user.toString());
        });

        // Delete the group
        await GroupModel.findByIdAndDelete(groupId);
        console.log(`Cleanup: Deleted inactive group: ${groupId}`);

        // Emit to the group room (existing)
        cleanupIo.to(`group-${groupId}`).emit("group-deleted", {
          success: true,
          groupId,
          message: "Group has been deleted due to inactivity",
        });

        // Additionally, emit to each member's personal user-groups room
        membersToNotify.forEach((memberId) => {
          cleanupIo.to(`user-groups-${memberId}`).emit("group-deleted", {
            success: true,
            groupId,
            message: "Group has been deleted due to inactivity",
          });
        });

        groupLastActivity.delete(groupId);
      } catch (error) {
        console.error(`Cleanup: Error deleting group ${groupId}:`, error);
      }
    }
  } catch (error) {
    console.error("Cleanup: Error in deleteInactiveGroups:", error);
  }
};

const kickInactiveUsers = async () => {
  if (!cleanupIo) {
    console.error("Cleanup: io instance not available");
    return;
  }

  try {
    const now = new Date();
    const THIRTY_MINUTES = 20 * 60 * 1000;
    const usersToKick = [];

    for (const [socketId, groupSessions] of userGroupActivity.entries()) {
      for (const [groupId, activity] of groupSessions.entries()) {
        const timeSinceLastMessage = now - new Date(activity.lastMessageSent);

        if (timeSinceLastMessage >= THIRTY_MINUTES) {
          usersToKick.push({
            socketId,
            groupId,
            userId: activity.userId,
          });
        }
      }
    }

    for (const user of usersToKick) {
      try {
        const group = await GroupModel.findById(user.groupId);

        if (!group) {
          console.log(
            `Cleanup: Group ${user.groupId} not found, skipping user ${user.userId}`
          );
          userGroupActivity.delete(user.socketId);
          continue;
        }

        const userRole = group.getUserRole(user.userId);

        if (userRole === "admin") {
          console.log(
            `Cleanup: User ${user.userId} is admin of group ${user.groupId}, skipping kick`
          );
          const activity = userGroupActivity.get(user.socketId);
          if (activity) {
            activity.lastMessageSent = new Date();
            activity.lastActive = new Date();
          }
          continue;
        }

        if (userRole !== "active") {
          console.log(
            `Cleanup: User ${user.userId} is not an active user in group ${user.groupId} (role: ${userRole}), skipping`
          );
          userGroupActivity.delete(user.socketId);
          continue;
        }

        await group.removeUser(user.userId);

        console.log(
          `Cleanup: Removed user ${user.userId} from active users in group ${user.groupId}`
        );

        const socket = cleanupIo.sockets.sockets.get(user.socketId);

        if (socket) {
          socket.emit("user-kicked", {
            success: false,
            groupId: user.groupId,
            message: "you have been kicked as a active user",
            reason: "inactivity",
            removedFromActiveUsers: true,
          });

          socket.leave(`group-${user.groupId}`);

          ////////////////
          updateGroupCounters(user.groupId, userRole, "leave");
          cleanupIo.emit("group-counters-updated", {
            groupId: group._id,
            activeUsers: groupCounters.get(group._id).active,
            guests: groupCounters.get(group._id).guests,
          });
          /////////////////////

          socket.to(`group-${user.groupId}`).emit("user-removed", {
            userId: user.userId,
            username: socket.user?.username,
            groupId: user.groupId,
            reason: "inactivity",
            removedFromActiveUsers: true,
            timestamp: new Date(),
            activeUsersCount: group.activeUsers.length,
          });

          console.log(
            `Cleanup: Kicked inactive user ${user.userId} from group ${user.groupId} and removed from active users`
          );
        } else {
          cleanupIo.to(`group-${user.groupId}`).emit("user-removed", {
            userId: user.userId,
            groupId: user.groupId,
            reason: "inactivity",
            removedFromActiveUsers: true,
            timestamp: new Date(),
            activeUsersCount: group.activeUsers.length,
          });

          console.log(
            `Cleanup: Removed inactive user ${user.userId} from active users in group ${user.groupId} (user offline)`
          );
        }

        removeUserActivity(user.socketId, user.groupId); // FIX: Changed from userGroupActivity.delete(user.socketId) to per-group removal
      } catch (error) {
        console.error(`Cleanup: Error kicking user ${user.userId}:`, error);
      }
    }
  } catch (error) {
    console.error("Cleanup: Error in kickInactiveUsers:", error);
  }
};

export const startCleanupIntervals = (ioInstance) => {
  cleanupIo = ioInstance;

  if (!cleanupIo) {
    console.error("Cannot start cleanup intervals: io instance is null");
    return;
  }

  setInterval(() => {
    console.log("Cleanup: Running deleteInactiveGroups check...");
    deleteInactiveGroups();
  }, 15 * 60 * 1000);

  setInterval(() => {
    console.log("Cleanup: Running kickInactiveUsers check...");
    kickInactiveUsers();
  }, 10 * 60 * 1000);

  console.log("Cleanup: Group cleanup intervals started");
};
