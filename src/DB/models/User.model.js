

// import mongoose, { Schema, Types, model } from "mongoose";

// export const roletypes = { User: "User", Admin: "Admin", Owner:"Owner"}
// export const providerTypes = { system: "system", google: "google" }

// const userSchema = new Schema({
//     fullName: { type: String, required: true },
//     email: { type: String, unique: true, sparse: true, trim: true },
//     phone: { type: String, unique: true, sparse: true, trim: true },

//     password: { type: String },
//     isConfirmed: { type:Boolean ,default:false },
//     accountType: { type: String, enum: ['User', 'ServiceProvider'], required: true },
//     serviceType: { type: String, enum: ['Driver', 'Doctor', 'Host', 'Delivery'], default: null },
//     // الربط مع بيانات الخدمة (مثلاً DoctorProfile)
//     serviceRef: {
//         type: mongoose.Schema.Types.ObjectId,
//         refPath: 'serviceTypeRef',
//     },
//     serviceTypeRef: {
//         type: String,
//         enum: ['DriverProfile', 'DoctorProfile', 'HostProfile', 'DeliveryProfile'],
//     },
//     emailOTP: String,
//     forgetpasswordOTP: String,
//     attemptCount: Number,
//     otpExpiresAt: Date,
//     blockUntil: {
//         type: Date,
//     },
// },
//     {
//         timestamps: true,
//         toJSON: { virtuals: true },
//         toObject: { virtuals: true }
//     }

// );




// const Usermodel = mongoose.model("User", userSchema);
// export default Usermodel;
// export const scketConnections = new Map()
// export const onlineUsers = new Map();



import mongoose, { Schema, Types, model } from "mongoose";

export const roletypes = { User: "User", Admin: "Admin", Owner: "Owner" };
export const providerTypes = { system: "system", google: "google" };

const userSchema = new Schema({
    username: { type: String },
    role: { type: String, default: 'User' },
    email: { type: String, },
    phone: { type: String,  sparse: true, trim: true },

    password: { type: String },
    isConfirmed: { type: Boolean, default: false },
    carNumber: { type: Number, default: 0 },
    isAgree: { type: Boolean, default: false },

    kiloPrice: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    modelcar: { type: String, default: null },
    accountType: {
        type: String,
        enum: ['User', 'ServiceProvider', 'Owner', 'manager', 'staff','Admin'],
        // required: true
    },



    serviceRef: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'serviceTypeRef',
    },

         ImageId: {
                type: mongoose.Schema.Types.ObjectId,
             ref: "CartoonImage",
                default: null
            },

 
    fcmToken: { type: String, default: null },
    isOnline: { type: Boolean , default: false },
    userId: String,
    // OTPs
    emailOTP: String,
    forgetpasswordOTP: String,
    attemptCount: Number,
    otpExpiresAt: Date,
    blockUntil: { type: Date },
    lastUsernameUpdate: {
        type: Date,
        default: null
    },

    // 🎯 بيانات إضافية عامة لمقدمي الخدمة

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}); 
userSchema.virtual("subscriptionDaysLeft").get(function () {
    if (!this.subscription?.endDate) return null;
    const diff = Math.ceil(
        (this.subscription.endDate - new Date()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
});

userSchema.virtual("subscriptionDaysUsed").get(function () {
    if (!this.subscription?.startDate) return null;
    const diff = Math.ceil(
        (new Date() - this.subscription.startDate) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
});

const Usermodel = mongoose.model("User", userSchema);
userSchema.index({ location: "2dsphere" });
export default Usermodel;

export const scketConnections = new Map();
export const onlineUsers = new Map();





// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDIwZjM3YTAzMGEwYzIzNzEyYjc0ZCIsImlhdCI6MTc2NTkzNjk1MSwiZXhwIjoxNzk3NDcyOTUxfQ.lF3R0fe2cGRIz4Y8UxxVs2p8LCjo9D7tHvTC5qcpuZ4



// metr @DESKTOP-26VIBMK MINGW64 ~(master)
// $ cd / c / Users / metr / Desktop / ecoomersse

// metr @DESKTOP-26VIBMK MINGW64 ~/Desktop/ecoomersse(main)
// $ ^ [[200~git init
// bash: $'\E[200~git': command not found

// metr@DESKTOP - 26VIBMK MINGW64 ~/Desktop/ecoomersse(main)
// $ ^ [[200~git add.
//         bash: $'\E[200~git': command not found

// metr@DESKTOP - 26VIBMK MINGW64 ~/Desktop/ecoomersse(main)
// $ git commit - m "Initial commit"
// On branch main
// Your branch is up to date with 'origin/main'.

// Changes not staged for commit:
//     (use "git add <file>..." to update what will be committed)
// (use "git restore <file>..." to discard changes in working directory)
// modified: src / modules / auth / service / regestration.service.js

// no changes added to commit(use "git add" and / or "git commit -a")

// metr @DESKTOP-26VIBMK MINGW64 ~/Desktop/ecoomersse(main)
// $ ^ C

// metr @DESKTOP-26VIBMK MINGW64 ~/Desktop/ecoomersse(main)
// $ git add.

//     metr@DESKTOP-26VIBMK MINGW64 ~/Desktop/ecoomersse(main)
// $ git commit - m "Initial commit"
// [main 93595c4] Initial commit
// 1 file changed, 15 insertions(+), 25 deletions(-)

// metr @DESKTOP-26VIBMK MINGW64 ~/Desktop/ecoomersse(main)
// $ ^ C

// metr @DESKTOP-26VIBMK MINGW64 ~/Desktop/ecoomersse(main)
// $ git push origin main
// Enumerating objects: 13, done.
// Counting objects: 100 % (13 / 13), done.
// Delta compression using up to 4 threads
// Compressing objects: 100 % (7 / 7), done.
// Writing objects: 100 % (7 / 7), 802 bytes | 160.00 KiB / s, done.
//     Total 7(delta 6), reused 0(delta 0), pack - reused 0
// remote: Resolving deltas: 100 % (6 / 6), completed with 6 local objects.
// To github.com: AbdoCraftsCode / eccomerce.git
// a194b2f..93595c4  main -> main

// metr @DESKTOP-26VIBMK MINGW64 ~/Desktop/ecoomersse(main)
// $ ^ C

// metr @DESKTOP-26VIBMK MINGW64 ~/Desktop/ecoomersse(main)
// $
