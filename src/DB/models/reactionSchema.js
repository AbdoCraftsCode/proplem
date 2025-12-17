// import mongoose from "mongoose";



// const reactionSchema = new mongoose.Schema(
//     {
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },
//         type: {
//             type: String,
//             enum: ["like", "love", "sad", "angry"],
//             required: true
//         }
//     },
//     { timestamps: true }
// );

// // لمنع المستخدم من عمل أكثر من reaction من نفس النوع على نفس العنصر
// reactionSchema.index({ user: 1, type: 1 });

// // 📌 Schema للكومنت (يدعم الردود المتداخلة)
// const commentSchema = new mongoose.Schema(
//     {
//         text: {
//             type: String,
//             required: true,
//             trim: true
//         },
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },
//         parentComment: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Commenttt",
//             default: null
//         },
//         reactions: [reactionSchema]
//     },
//     {
//         timestamps: true,
//         toJSON: { virtuals: true },
//         toObject: { virtuals: true }
//     }
// );

// // فهرسة لتسهيل جلب الردود على كومنت معين
// commentSchema.index({ parentComment: 1 });

// // 📌 Schema للبوست
// const postSchema = new mongoose.Schema(
//     {
//         text: {
//             type: String,
//             required: true,
//             trim: true
//         },

//         status: {
//             type: String,
//             enum: ["pending", "accepted", "rejected"],
//             default: "pending"
//         },
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },
//         // الكومنتات الرئيسية فقط (مش الردود)
//         comments: [
//             {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Commenttt"
//             }
//         ],
//         reactions: [reactionSchema]
//     },
//     {
//         timestamps: true,
//         toJSON: { virtuals: true },
//         toObject: { virtuals: true }
//     }
// );

// // فهرسة لتحسين الأداء عند جلب بوستات مستخدم معين
// postSchema.index({ user: 1, createdAt: -1 });

// // 📌 إنشاء الموديلز
// export const Posttt = mongoose.model("Posttt", postSchema);
// export const Commenttt = mongoose.model("Commenttt", commentSchema);

// // إذا كنت عايز تصدر الـ reactionSchema لوحده (اختياري)
// export { reactionSchema };


import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "love", "sad", "angry"], required: true }
}, { timestamps: true });

reactionSchema.index({ user: 1, type: 1 });

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",  // <-- مهم جدًا: Comment مش Commenttt
        default: null
    },
    reactions: [reactionSchema]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

commentSchema.index({ parentComment: 1 });

const postSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"  // <-- مهم: Comment مش Commenttt
    }],
    reactions: [reactionSchema]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

postSchema.index({ user: 1, createdAt: -1 });

// الموديلز بأسماء نظيفة
export const Posttt = mongoose.model("Post", postSchema);
export const Commenttt = mongoose.model("Comment", commentSchema);