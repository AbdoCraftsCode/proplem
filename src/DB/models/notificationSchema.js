// models/notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    title: {
        ar: { type: String, required: true },
        en: { type: String, required: true }
    },

    body: {
        ar: { type: String, required: true },
        en: { type: String, required: true }
    },

    type: {
        type: String,
        required: true,
        enum: ["reaction", "comment", "like", "follow", "mention", "post_status"], // يمكنك إضافة أنواع أخرى
        default: "other"
    },

    deviceToken: {
        type: String
    },

    isRead: {
        type: Boolean,
        default: false
    },

    // اختياري: لو عايز تضيف data إضافية (مثل postId أو commentId)
    data: {
        type: Map,
        of: String,
        default: {}
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// فهرسة للأداء
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

export const NotificationModell = mongoose.model("Notificationnnnnn", notificationSchema); // غيرت الاسم للنظافة: Notification بدل Notificationnnn