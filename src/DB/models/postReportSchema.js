
import mongoose from "mongoose"
const postReportSchema = new mongoose.Schema(
    {
        // ID البوست اللي تم البلاغ عليه
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",  // أو "Posttt" لو لسة بتستخدم الاسم القديم
            required: true,
        },

        // ID صاحب البلاغ (المستخدم اللي بلغ)
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // نوع البلاغ (اختياري من قائمة محددة)
        reportType: {
            type: String,
            enum: [
                "spam",              // سبام
                "inappropriate",     // محتوى غير لائق
                "harassment",        // تحرش أو إساءة
                "violence",          // عنف أو تهديد
                "hate_speech",       // خطاب كراهية
                "false_information", // معلومات مضللة أو كاذبة
                "copyright",         // انتهاك حقوق نشر
                "other"              // أخرى
            ],
            // required: true,
        },

        // رسالة البلاغ (تفاصيل إضافية من المستخدم)
        message: {
            type: String,
            // required: true,
            trim: true,
            // minlength: 10,
            maxlength: 500,
        },


        status: {
            type: String,
            enum: ["pending", "reviewed", "resolved", "dismissed"],
            default: "pending",
        },

        // ملاحظات الأدمن بعد المراجعة (اختياري)
        adminNote: {
            type: String,
            default: null,
        },

        // من قام بمراجعة البلاغ (الأدمن)
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true, // createdAt و updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// منع المستخدم من عمل أكثر من بلاغ واحد على نفس البوست
postReportSchema.index({ postId: 1, reportedBy: 1 }, { unique: true });

// فهرسة لتسهيل جلب البلاغات حسب البوست أو المستخدم
postReportSchema.index({ postId: 1, createdAt: -1 });
postReportSchema.index({ reportedBy: 1, createdAt: -1 });
postReportSchema.index({ status: 1 });

export const PostReport = mongoose.model("PostReport", postReportSchema);