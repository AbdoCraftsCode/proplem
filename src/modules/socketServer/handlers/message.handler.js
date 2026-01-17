import { GroupModel } from "../../../DB/models/group.model.js";
import { updateUserLastMessage } from "../socketIndex.js";
import { checkUserName } from "../utils/checkUsername.js";

export const handleSendGroupMessage = async (io, socket, data) => {
  try {
    if (!checkUserName(socket.user)) {
      socket.emit("message-error", {
        success: false,
        message: "user expired",
      });
      return;
    }
    const { groupId, content, image, voice, type = "text" } = data;

    console.log(
      `User ${socket.user.username} sending message to group ${groupId}`
    );

    if (!groupId) {
      socket.emit("message-error", {
        success: false,
        message: "Group ID is required",
      });
      return;
    }

    const group = await GroupModel.findById(groupId);
    if (!group) {
      socket.emit("message-error", {
        success: false,
        message: "Group not found",
      });
      return;
    }

    const userRole = group.getUserRole(socket.user._id);
    if (userRole !== "admin" && userRole !== "active") {
      socket.emit("message-error", {
        success: false,
        message: "Only active members and admin can send messages",
      });
      return;
    }

    // Validate message content based on type
    if (type === "text" && !content) {
      socket.emit("message-error", {
        success: false,
        message: "Text message requires content",
      });
      return;
    }

    if (type === "image" && !image?.url) {
      socket.emit("message-error", {
        success: false,
        message: "Image message requires image URL",
      });
      return;
    }

    if (type === "voice" && !voice?.url) {
      socket.emit("message-error", {
        success: false,
        message: "Voice message requires voice URL",
      });
      return;
    }

    const message = {
      sender: socket.user._id,
      content,
      image,
      voice,
      type,
    };

    group.messages.push(message);
    await group.save();

    const savedMessage = group.messages[group.messages.length - 1];

    const messageWithSender = {
      ...savedMessage.toObject(),
      sender: {
        _id: socket.user._id,
        username: socket.user.username,
        email: socket.user.email,
      },
    };

    updateUserLastMessage(socket.id, group._id);

    const populatedUser = await socket.user.populate("ImageId");

    io.to(`group-${groupId}`).emit("new-group-message", {
      success: true,
      message: messageWithSender,
      group: {
        _id: group._id,
        name: group.name,
        admin: group.admin,
      },
      fromUser: {
        _id: populatedUser._id,
        username: populatedUser.username,
        avatar: populatedUser.ImageId,
      },
    });

    const allMembers = new Set();

    group.activeUsers.forEach((user) => {
      allMembers.add(user.user.toString());
    });

    allMembers.add(group.admin.toString());

    allMembers.forEach((memberId) => {
      const groupUpdate = {
        _id: group._id,
        name: group.name,
        lastMessage: {
          content: content || (type === "image" ? "Image" : "Voice message"),
          type,
          senderId: socket.user._id,
          senderName: socket.user.username,
          timestamp: savedMessage.createdAt,
        },
        updatedAt: new Date(),
      };

      io.to(`user-groups-${memberId}`).emit("group-updated", {
        success: true,
        group: groupUpdate,
        message: savedMessage,
      });
    });
  } catch (error) {
    console.error("Error sending message:", error);
    socket.emit("message-error", {
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};
