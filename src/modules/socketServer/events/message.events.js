import { handleSendGroupMessage } from "../handlers/message.handler.js";

export const setupMessageEvents = (io, socket) => {
  socket.on("send-group-message", async (data) => {
    await handleSendGroupMessage(io, socket, data);
  });
};