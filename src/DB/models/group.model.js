import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return !this.image && !this.voice;
      },
    },
    image: {
      url: String,
      public_id: String,
    },
    voice: {
      url: String,
      duration: Number,
      public_id: String,
    },
    type: {
      type: String,
      enum: ["text", "image", "voice"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activeUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    messages: [messageSchema],
    maxActiveUsers: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
  }
);

groupSchema.index({ "activeUsers.user": 1 });
groupSchema.index({ admin: 1 });

groupSchema.virtual("activeUsersCount").get(function () {
  return this.activeUsers.length;
});

groupSchema.methods.isActiveUser = function (userId) {
  return this.activeUsers.some(
    (activeUser) => activeUser.user.toString() === userId.toString()
  );
};

const getId = (obj) => {
  if (!obj) return null;
  if (obj._id) {
    return obj._id.toString();
  }
  return obj.toString();
};

groupSchema.methods.isMember = function (userId) {
  const userIdStr = userId.toString ? userId.toString() : userId;

  if (getId(this.admin) === userIdStr) {
    return true;
  }

  return this.activeUsers.some(
    (activeUser) => getId(activeUser.user) === userIdStr
  );
};

groupSchema.methods.hasActiveSpace = function () {
  return this.activeUsers.length < this.maxActiveUsers;
};

groupSchema.methods.addActiveUser = async function (userId) {
  if (!this.hasActiveSpace()) {
    throw new Error("Group is full. Maximum 5 active users allowed.");
  }

  if (this.isActiveUser(userId)) {
    throw new Error("User is already an active member.");
  }

  this.activeUsers.push({
    user: userId,
  });

  return this.save();
};

groupSchema.methods.removeUser = async function (userId) {
  this.activeUsers = this.activeUsers.filter(
    (activeUser) => activeUser.user.toString() !== userId.toString()
  );

  return this.save();
};

groupSchema.methods.getUserRole = function (userId) {
  if (this.admin.toString() === userId.toString()) {
    return "admin";
  }
  if (this.isActiveUser(userId)) {
    return "active";
  }
  return "guest";
};

export const GroupModel = mongoose.model("Group", groupSchema);
