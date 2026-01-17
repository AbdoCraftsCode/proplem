import { handleDisconnection } from "../handlers/connection.handler.js";
import { connectedUsers } from "../socketIndex.js";

export const setupConnectionEvents = (io, socket) => {
  try {
    if (!connectedUsers.has(socket.user._id)) {
      connectedUsers.set(socket.user._id, new Set());
    }
    connectedUsers.get(socket.user._id).add(socket.id);

    socket.join(`user-groups-${socket.user._id}`);

    socket.emit("connection-success", {
      success: true,
      message: "Connected to chat server",
      userId: socket.user._id,
      username: socket.user.username,
    });

    socket.on("disconnect", async (reason) => {
      await handleDisconnection(socket, reason);
    });
  } catch (error) {
    console.error("Error setting up connection events:", error);
  }
};
