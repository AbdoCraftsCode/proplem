import { asyncHandelr } from "../../../utlis/response/error.response.js";
import { GroupModel } from "../../../DB/models/group.model.js";

export const joinAsActive = asyncHandelr(async (req, res, next) => {
  const userId = req.user._id;
  const { groupId } = req.body;

  try {
    const group = await checkCanJoinAsActive(groupId, userId);
    await group.addActiveUser(userId);

    res.status(200).json({
      success: true,
      message: "Successfully joined as active member",
      data: {
        groupId,
        groupName: group.name,
        activeUsersCount: group.activeUsers.length,
        joinedAt: new Date(),
      },
    });
  } catch (error) {
    return next(new Error(error.message, { cause: 400 }));
  }
});

export const joinAsGuest = asyncHandelr(async (req, res, next) => {
  const userId = req.user._id;
  const { groupId } = req.body;

  try {
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return next(new Error("Group not found", { cause: 404 }));
    }

    if (group.isMember(userId)) {
      return next(new Error("User is already in the group", { cause: 400 }));
    }

    await group.addGuest(userId);

    res.status(200).json({
      success: true,
      message: "Successfully joined as guest",
      data: {
        groupId,
        groupName: group.name,
        guestsCount: group.guests.length,
        joinedAt: new Date(),
      },
    });
  } catch (error) {
    return next(new Error(error.message, { cause: 400 }));
  }
});

export const createGroup = asyncHandelr(async (req, res, next) => {
  const userId = req.user._id;
  const { name, description, avatar } = req.body;

  const group = await GroupModel.create({
    name,
    description,
    admin: userId,
    activeUsers: [{ user: userId }],
    avatar,
  });

  res.status(201).json({
    success: true,
    message: "Group created successfully",
    data: group,
  });
});

export const getUserGroups = asyncHandelr(async (req, res, next) => {
  const userId = req.user._id;

  const allGroups = await GroupModel.find({ isActive: true }).select("-messages");

  const sortedGroups = allGroups.sort((a, b) => {
    const aIsAdmin = a.admin.toString() === userId.toString();
    const bIsAdmin = b.admin.toString() === userId.toString();
    
    if (aIsAdmin && !bIsAdmin) return -1;
    if (!aIsAdmin && bIsAdmin) return 1;
    
    const aIsMember = a.isMember(userId);
    const bIsMember = b.isMember(userId);
    
    if (aIsMember && !bIsMember) return -1;
    if (!aIsMember && bIsMember) return 1;
    
    return 0;
  });

  const formattedGroups = sortedGroups.map(group => ({
    ...group.toObject(),
    userRole: group.getUserRole(userId),
    isMember: group.isMember(userId)
  }));

  res.status(200).json({
    success: true,
    data: formattedGroups,
  });
});

export const getGroupMessages = asyncHandelr(async (req, res, next) => {
  const { groupId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const group = await GroupModel.findById(groupId)
    .populate({
      path: "messages.sender",
      select: "username email avatar",
    })
    .populate({
      path: "admin",
      select: "username email avatar",
    })
    .populate({
      path: "activeUsers.user",
      select: "username email avatar",
    });

  if (!group) {
    return next(new Error("Group not found", { cause: 404 }));
  }

  const totalMessages = group.messages.length;
  const totalPages = Math.ceil(totalMessages / limit);
  const skip = (page - 1) * limit;

  const sortedMessages = [...group.messages].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const paginatedMessages = sortedMessages.slice(skip, skip + limit);

  res.status(200).json({
    success: true,
    message: "Group messages retrieved successfully",
    data: {
      groupId: group._id,
      groupName: group.name,
      admin: group.admin
        ? {
            _id: group.admin._id,
            username: group.admin.username,
            email: group.admin.email,
            avatar: group.admin.avatar,
          }
        : null,
      activeUsers: group.activeUsers.map((au) => ({
        user: au.user
          ? {
              _id: au.user._id,
              username: au.user.username,
              email: au.user.email,
              avatar: au.user.avatar,
            }
          : null,
        joinedAt: au.joinedAt,
      })),
      totalMessages,
      currentPage: page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      messages: paginatedMessages.map((msg) => ({
        _id: msg._id,
        sender: msg.sender
          ? {
              _id: msg.sender._id,
              username: msg.sender.username,
              email: msg.sender.email,
              avatar: msg.sender.avatar,
            }
          : null,
        content: msg.content,
        type: msg.type,
        image: msg.image,
        voice: msg.voice,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
      })),
    },
  });
});

// Optional: Get single message by ID
export const getMessageById = asyncHandelr(async (req, res, next) => {
  const userId = req.user._id;
  const { groupId, messageId } = req.params;

  const group = await GroupModel.findById(groupId);

  if (!group) {
    return next(new Error("Group not found", { cause: 404 }));
  }

  // Check if user is a member
  if (!group.isMember(userId)) {
    return next(
      new Error("You are not a member of this group", { cause: 403 })
    );
  }

  // Find the message
  const message = group.messages.id(messageId);

  if (!message) {
    return next(new Error("Message not found", { cause: 404 }));
  }

  res.status(200).json({
    success: true,
    message: "Message retrieved successfully",
    data: {
      groupId: group._id,
      groupName: group.name,
      message: {
        _id: message._id,
        sender: message.sender,
        content: message.content,
        type: message.type,
        image: message.image,
        voice: message.voice,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      },
    },
  });
});

export const checkCanJoinAsActive = async (groupId, userId) => {
  const group = await GroupModel.findById(groupId);
  if (!group) {
    throw new Error("Group not found");
  }

  if (group.isMember(userId)) {
    throw new Error("User is already a member");
  }

  if (!group.hasActiveSpace()) {
    throw new Error("Group is full. Maximum 5 active users allowed.");
  }

  return group;
};
