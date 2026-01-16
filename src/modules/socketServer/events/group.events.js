import { 
  handleJoinGroup, 
  handleLeaveGroup, 
  handleTyping 
} from "../handlers/group.handler.js";

export const setupGroupEvents = (io, socket) => {
  socket.on("join-group", async (data) => {
    await handleJoinGroup(io, socket, data);
  });

  socket.on("leave-group", (data) => {
    handleLeaveGroup(io, socket, data);
  });

  socket.on("typing", (data) => {
    handleTyping(io, socket, data);
  });
};