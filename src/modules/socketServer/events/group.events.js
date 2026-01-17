import {
  handleJoinGroup,
  handleLeaveGroup,
  handleTyping,
} from "../handlers/group.handler.js";

export const setupGroupEvents = (io, socket) => {
  try {
    socket.on("join-group", async (data) => {
      await handleJoinGroup(io, socket, data);
    });

    socket.on("leave-group", async (data) => {
      await handleLeaveGroup(io, socket, data);
    });

    socket.on("typing", (data) => {
      handleTyping(io, socket, data);
    });
  } catch (error) {
    console.error("Error setting up group events:", error);
  }
};
