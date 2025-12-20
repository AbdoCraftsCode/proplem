import mongoose from "mongoose";

const privacyPolicySchema = new mongoose.Schema({
    content: {
        ar: {
            type: String,
            required: true,
            trim: true,
        },
        en: {
            type: String,
            required: true,
            trim: true,
        }
    },
    version: {
        type: String,
        required: true,
        unique: true, // عشان كل إصدار يكون فريد
        default: "1.0"
    },
    isActive: {
        type: Boolean,
        default: true // الإصدار النشط
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // يحدث updatedAt تلقائيًا
});

// فهرسة للإصدار النشط
privacyPolicySchema.index({ isActive: 1 });

export const PrivacyPolicy = mongoose.model("PrivacyPolicyyyy", privacyPolicySchema);