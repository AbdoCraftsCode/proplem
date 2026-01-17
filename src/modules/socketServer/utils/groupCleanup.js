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

    // Step 1: Collect candidates and clean guests/admins
    for (const [socketId, groupSessions] of userGroupActivity.entries()) {
      const socket = cleanupIo.sockets.sockets.get(socketId);
      const isOnline = !!socket;

      for (const [groupId, activity] of [...groupSessions.entries()]) {
        // copy to avoid mutation issues
        const group = await GroupModel.findById(groupId);
        if (!group) {
          removeUserActivity(socketId, groupId);
          continue;
        }

        const userRole = group.getUserRole(activity.userId);

        if (userRole === "guest") {
          // Guests: never kick, but clean old (flag=false) activities
          if (activity.flag === false) {
            console.log(
              `Cleanup: Removing stale guest activity for user ${activity.userId} in group ${groupId}`
            );
            removeUserActivity(socketId, groupId);
          }
          // Keep flag=true even if old lastMessageSent
          continue;
        }

        if (userRole === "admin") {
          // Admins: never kick, reset timer, keep flag=true activity
          if (activity.flag === true) {
            activity.lastMessageSent = new Date();
            activity.lastActive = new Date();
            console.log(
              `Admin ${activity.userId} activity refreshed in group ${groupId}`
            );
          } else {
            removeUserActivity(socketId, groupId);
          }
          continue;
        }

        if (userRole === "active") {
          const timeSinceLastMessage = now - new Date(activity.lastMessageSent);

          if (timeSinceLastMessage >= THIRTY_MINUTES) {
            // Only collect active users who are inactive
            usersToKick.push({
              socketId,
              groupId,
              userId: activity.userId,
              isOnline,
            });
          }
          // We don't remove here — only after successful kick
        }
      }
    }

    // Step 2: Kick inactive active users
    for (const user of usersToKick) {
      try {
        const group = await GroupModel.findById(user.groupId);
        if (!group) {
          removeUserActivity(user.socketId, user.groupId);
          continue;
        }

        // Double-check role (in case changed)
        const userRole = group.getUserRole(user.userId);
        if (userRole !== "active") continue;

        // Remove from active users in DB
        await group.removeUser(user.userId);
        await group.save();

        console.log(
          `Cleanup: Removed inactive active user ${user.userId} from group ${user.groupId}`
        );

        // Update counters
        updateGroupCounters(user.groupId, userRole, "leave");
        cleanupIo.emit("group-counters-updated", {
          groupId: group._id,
          activeUsers: groupCounters.get(user.groupId)?.active || 0,
          guests: groupCounters.get(user.groupId)?.guests || 0,
        });

        // Notify
        const eventPayload = {
          userId: user.userId,
          groupId: user.groupId,
          reason: "inactivity",
          removedFromActiveUsers: true,
          timestamp: new Date(),
          activeUsersCount: group.activeUsers.length,
        };

        if (user.isOnline) {
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

            socket.to(`group-${user.groupId}`).emit("user-removed", {
              ...eventPayload,
              username: socket.user?.username || "Unknown",
            });

            console.log(
              `Kicked online inactive user ${user.userId} from ${user.groupId}`
            );
          }
        } else {
          // Offline user
          cleanupIo.to(`group-${user.groupId}`).emit("user-removed", {
            ...eventPayload,
            username: "Offline User",
          });

          console.log(
            `Removed offline inactive user ${user.userId} from ${user.groupId}`
          );
        }

        // Remove this specific group activity
        removeUserActivity(user.socketId, user.groupId);

        // Step 3: Check if group is now empty
        const room = cleanupIo.sockets.adapter.rooms.get(
          `group-${user.groupId}`
        );
        if (!room || room.size === 0) {
          markGroupForDeletion(user.groupId);
          console.log(
            `Group ${user.groupId} marked for deletion after kick (empty)`
          );
        }
      } catch (error) {
        console.error(`Cleanup error kicking user ${user.userId}:`, error);
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
