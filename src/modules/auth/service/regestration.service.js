import { asyncHandelr } from "../../../utlis/response/error.response.js";
// import { Emailevent} from "../../../utlis/events/email.emit.js";
import *as dbservice from "../../../DB/dbservice.js"
import Usermodel, { providerTypes, roletypes } from "../../../DB/models/User.model.js";
import { comparehash, encryptData, generatehash } from "../../../utlis/security/hash.security.js";
import { successresponse } from "../../../utlis/response/success.response.js";
import { OAuth2Client } from "google-auth-library";
import { generatetoken } from "../../../utlis/security/Token.security.js";
import cloud from "../../../utlis/multer/cloudinary.js";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import { RestaurantModel } from "../../../DB/models/RestaurantSchema.model.js";
import { BranchModel } from "../../../DB/models/BranchopaSchema.model.js";
import { Emailevent } from "../../../utlis/events/email.emit.js";
import { MainGroupModel } from "../../../DB/models/mainGroupSchema.model.js";
import { SubGroupModel } from "../../../DB/models/subGroupSchema.model.js";
import { PermissionModel } from "../../../DB/models/permissionSchema.model.js";
import { AdminUserModel } from "../../../DB/models/adminUserSchema.model.js";
import { QuestionModel } from "../../../DB/models/question2Schema.model.js";
import { EvaluationModel } from "../../../DB/models/evaluationStatusSchema.model.js";
import evaluateModel from "../../../DB/models/evaluate.model.js";
import RentalPropertyModel from "../../../DB/models/rentalPropertySchema.model.js";
import DoctorModel from "../../../DB/models/workingHoursSchema.model.js";
import { ProductModell, RestaurantModell } from "../../../DB/models/productSchema.model.js";
import { OrderModel } from "../../../DB/models/orderSchema.model.js";
import { NotificationModell } from "../../../DB/models/notificationSchema.js";
dotenv.config();
import admin from 'firebase-admin';
import { AppointmentModel } from "../../../DB/models/appointmentSchema.js";
import rideSchema from "../../../DB/models/rideSchema.js";
import { ProductModelllll, SectionModel, SupermarketModel } from "../../../DB/models/supermarket.js";
import { OrderModellllll } from "../../../DB/models/customItemSchemaorder.js";
import { nanoid, customAlphabet } from "nanoid";
// const AUTHENTICA_API_KEY = process.env.AUTHENTICA_API_KEY || "$2y$10$q3BAdOAyWapl3B9YtEVXK.DHmJf/yaOqF4U.MpbBmR8bwjSxm4A6W";
// const AUTHENTICA_OTP_URL = "https://api.authentica.sa/api/v1/send-otp";
import fs from 'fs';


const AUTHENTICA_API_KEY = "ad5348edf3msh15d5daec987b64cp183e9fjsne1092498134c";
const AUTHENTICA_BASE_URL = "https://authentica1.p.rapidapi.com/api/v2";

export async function sendOTP(phone, method = "whatsapp") {
    try {
        const response = await axios.post(
            `${AUTHENTICA_BASE_URL}/send-otp`,
            {
                method: method, // sms | whatsapp | email
                phone: phone,
              
                // must include + and country code e.g. +2010xxxxxxx
            },
            {
                headers: {
                    "x-rapidapi-key": AUTHENTICA_API_KEY,
                    "x-rapidapi-host": "authentica1.p.rapidapi.com",
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        console.log("✅ OTP Sent Successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Failed to Send OTP:",
            error.response?.data || error.message
        );
        throw error;
    }
}


// await sendOTP("+201031697219", "sms"); 

// export const signup = asyncHandelr(async (req, res, next) => {
//     const { fullName, password, email, phone } = req.body;

//     // ✅ تحقق من وجود واحد من الاتنين فقط
//     if (!email && !phone) {
//         return next(new Error("يجب إدخال البريد الإلكتروني أو رقم الهاتف", { cause: 400 }));
//     }

//     // ✅ تحقق من عدم تكرار الإيميل أو رقم الهاتف
//     const checkuser = await dbservice.findOne({
//         model: Usermodel,
//         filter: {
//             $or: [
//                 ...(email ? [{ email }] : []),
//                 ...(phone ? [{ phone }] : [])
//             ]
//         }
//     });

//     if (checkuser) {
//         if (checkuser.email === email) {
//             return next(new Error("البريد الإلكتروني مستخدم من قبل", { cause: 400 }));
//         }
//         if (checkuser.phone === phone) {
//             return next(new Error("رقم الهاتف مستخدم من قبل", { cause: 400 }));
//         }
//     }

//     // ✅ تشفير كلمة المرور
//     const hashpassword = await generatehash({ planText: password });

//     // ✅ إنشاء المستخدم
//     const user = await dbservice.create({
//         model: Usermodel,
//         data: {
//             fullName,
//             password: hashpassword,
//             email,
//             phone,
//             accountType: 'User',  // 👈 تحديد إنه مستخدم عادي
//         }
//     });

//     // ✅ إرسال OTP
//     try {
//         if (phone) {
//             await sendOTP(phone);
//             console.log(`📩 OTP تم إرساله إلى الهاتف: ${phone}`);
//         }
//         else if (email) {
//             const otp = customAlphabet("0123456789", 6)();
//             const html = vervicaionemailtemplet({ code: otp });

//             // 👇 هنا كانت المشكلة – لازم await
//             const emailOTP = await generatehash({ planText: `${otp}` });

//             const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

//             await Usermodel.updateOne(
//                 { _id: user._id },
//                 { emailOTP, otpExpiresAt, attemptCount: 0 }
//             );

//             await sendemail({
//                 to: email,
//                 subject: "Confirm Email",
//                 text: "رمز التحقق الخاص بك",
//                 html,
//             });

//             console.log(`📩 OTP تم إرساله إلى البريد: ${email}`);
//         }

        
        
    
//     } catch (error) {
//         console.error("❌ فشل في إرسال OTP:", error.message);
//         return next(new Error("فشل في إرسال رمز التحقق", { cause: 500 }));
//     }
//     return successresponse(res, "تم إنشاء الحساب بنجاح، وتم إرسال رمز التحقق", 201);
// });


export const signup = asyncHandelr(async (req, res, next) => {
    const { fullName, password, email, phone } = req.body;

    // ✅ تحقق من وجود واحد من الاتنين فقط
    if (!email && !phone) {
        return next(new Error("يجب إدخال البريد الإلكتروني أو رقم الهاتف", { cause: 400 }));
    }

    // ✅ تحقق من عدم تكرار الإيميل أو رقم الهاتف
    const checkuser = await dbservice.findOne({
        model: Usermodel,
        filter: {
            $or: [
                ...(email ? [{ email }] : []),
                ...(phone ? [{ phone }] : [])
            ]
        }
    });

    // ✅ لو المستخدم موجود بالفعل
    if (checkuser) {
        // 👇 الشرط الجديد:
        if (checkuser.accountType === "ServiceProvider" &&
            (checkuser.serviceType === "Delivery" || checkuser.serviceType === "Driver")) {
            // 🟢 مسموح يكمل تسجيل كمستخدم عادي
            console.log("✅ نفس الإيميل/الهاتف موجود لمقدم خدمة Delivery أو Driver — السماح بالتسجيل كمستخدم عادي.");
        } else {
            // ❌ لو مش مقدم خدمة — ممنوع التسجيل
            if (checkuser.email === email) {
                return next(new Error("البريد الإلكتروني مستخدم من قبل", { cause: 400 }));
            }
            if (checkuser.phone === phone) {
                return next(new Error("رقم الهاتف مستخدم من قبل", { cause: 400 }));
            }
        }
    }

    // ✅ تشفير كلمة المرور
    const hashpassword = await generatehash({ planText: password });

    // ✅ إنشاء المستخدم
    const user = await dbservice.create({
        model: Usermodel,
        data: {
            fullName,
            password: hashpassword,
            email,
            phone,
            accountType: 'User',  // 👈 تحديد إنه مستخدم عادي
        }
    });

    // ✅ إرسال OTP
    try {
        if (phone) {
            await sendOTP(phone);
            console.log(`📩 OTP تم إرساله إلى الهاتف: ${phone}`);
        }
        else if (email) {
            const otp = customAlphabet("0123456789", 4)();
            const html = vervicaionemailtemplet({ code: otp });

            const emailOTP = await generatehash({ planText: `${otp}` });
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await Usermodel.updateOne(
                { _id: user._id },
                { emailOTP, otpExpiresAt, attemptCount: 0 }
            );

            await sendemail({
                to: email,
                subject: "Confirm Email",
                text: "رمز التحقق الخاص بك",
                html,
            });

            console.log(`📩 OTP تم إرساله إلى البريد: ${email}`);
        }

    } catch (error) {
        console.error("❌ فشل في إرسال OTP:", error.message);
        return next(new Error("فشل في إرسال رمز التحقق", { cause: 500 }));
    }

    return successresponse(res, "تم إنشاء الحساب بنجاح، وتم إرسال رمز التحقق", 201);
});










// export const forgetPassword = asyncHandelr(async (req, res, next) => {
//     const { email, phone } = req.body;

//     // ✅ التحقق من إدخال بريد إلكتروني أو رقم هاتف
//     if (!email && !phone) {
//         return next(new Error("❌ يجب إدخال البريد الإلكتروني أو رقم الهاتف", { cause: 400 }));
//     }

//     // 🔍 البحث عن المستخدم حسب المدخل
//     const user = await Usermodel.findOne({
//         $or: [
//             ...(email ? [{ email }] : []),
//             ...(phone ? [{ phone }] : [])
//         ]
//     });

//     if (!user) {
//         return next(new Error("❌ المستخدم غير موجود", { cause: 404 }));
//     }

//     // ✅ لو فيه رقم هاتف
//     if (phone) {
//         try {
//             const response = await axios.post(
//                 AUTHENTICA_OTP_URL,
//                 {
//                     phone,
//                     method: "whatsapp", // أو "sms" لو عايز
//                     number_of_digits: 6,
//                     otp_format: "numeric",
//                     is_fallback_on: 0
//                 },
//                 {
//                     headers: {
//                         "X-Authorization": AUTHENTICA_API_KEY,
//                         "Content-Type": "application/json",
//                         "Accept": "application/json"
//                     },
//                 }
//             );

//             console.log("✅ OTP تم إرساله بنجاح:", response.data);
//             return res.json({ success: true, message: "✅ تم إرسال كود التحقق إلى رقم الهاتف" });
//         } catch (error) {
//             console.error("❌ فشل في إرسال OTP للهاتف:", error.response?.data || error.message);
//             return res.status(500).json({
//                 success: false,
//                 error: "❌ فشل في إرسال كود التحقق عبر الهاتف",
//                 details: error.response?.data || error.message
//             });
//         }
//     }

//     // ✅ لو فيه بريد إلكتروني
//     if (email) {
//         try {
//             // 👇 توليد OTP عشوائي 6 أرقام
//             const otp = customAlphabet("0123456789", 6)();

//             // 👇 إنشاء قالب الإيميل
//             const html = vervicaionemailtemplet({ code: otp });

//             // 👇 تشفير الكود وتخزينه مؤقتًا
//             const hashedOtp = await generatehash({ planText: otp });
//             const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

//             await Usermodel.updateOne(
//                 { _id: user._id },
//                 { emailOTP: hashedOtp, otpExpiresAt, attemptCount: 0 }
//             );


//             // 👇 إرسال الإيميل
//             await sendemail({
//                 to: email,
//                 subject: "🔐 استعادة كلمة المرور",
//                 text: "رمز استعادة كلمة المرور",
//                 html,
//             });

//             console.log(`📩 تم إرسال الكود إلى البريد: ${email}`);
//             return res.json({ success: true, message: "✅ تم إرسال كود التحقق إلى البريد الإلكتروني" });
//         } catch (error) {
//             console.error("❌ فشل في إرسال كود عبر البريد:", error.message);
//             return res.status(500).json({
//                 success: false,
//                 error: "❌ فشل في إرسال كود التحقق عبر البريد",
//                 details: error.message
//             });
//         }
//     }
// });



export const forgetPassword = asyncHandelr(async (req, res, next) => {
    const { email, phone } = req.body;
    const { fedk, fedkdrivers } = req.query;

    if (!email && !phone) {
        return next(new Error("❌ يجب إدخال البريد الإلكتروني أو رقم الهاتف", { cause: 400 }));
    }

    let baseFilter = {
        $or: [
            ...(email ? [{ email }] : []),
            ...(phone ? [{ phone }] : [])
        ]
    };

    if (fedk) {
        baseFilter.$or = [
            ...(email ? [
                { email, accountType: "User" },
                { email, accountType: "ServiceProvider", serviceType: { $in: ["Host", "Doctor"] } }
            ] : []),
            ...(phone ? [
                { phone, accountType: "User" },
                { phone, accountType: "ServiceProvider", serviceType: { $in: ["Host", "Doctor"] } }
            ] : [])
        ];
    }

    if (fedkdrivers) {
        baseFilter.$or = [
            ...(email ? [
                { email, accountType: "ServiceProvider", serviceType: { $in: ["Driver", "Delivery"] } }
            ] : []),
            ...(phone ? [
                { phone, accountType: "ServiceProvider", serviceType: { $in: ["Driver", "Delivery"] } }
            ] : [])
        ];
    }

    const user = await Usermodel.findOne(baseFilter);

    if (!user) {
        return next(new Error("❌ المستخدم غير موجود", { cause: 404 }));
    }

    if (phone) {
        try {
            const response = await sendOTP(phone, "whatsapp"); // ✅ نستخدم الدالة الجاهزة

            console.log("✅ OTP تم إرساله بنجاح:", response);

            return res.json({
                success: true,
                message: "✅ تم إرسال كود التحقق إلى رقم الهاتف",
                user,
                otpInfo: response // 👈 لعرض بيانات الإرسال لو حبيت
            });
        } catch (error) {
            console.error("❌ فشل في إرسال OTP للهاتف:", error.response?.data || error.message);
            return res.status(500).json({
                success: false,
                error: "❌ فشل في إرسال كود التحقق عبر الهاتف",
                details: error.response?.data || error.message
            });
        }
    }

    if (email) {
        try {
            const otp = customAlphabet("0123456789", 4)();
            const html = vervicaionemailtemplet({ code: otp });
            const hashedOtp = await generatehash({ planText: otp });
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await Usermodel.updateOne(
                { _id: user._id },
                { emailOTP: hashedOtp, otpExpiresAt, attemptCount: 0 }
            );

            await sendemail({
                to: email,
                subject: "🔐 استعادة كلمة المرور",
                text: "رمز استعادة كلمة المرور",
                html,
            });

            console.log(`📩 تم إرسال الكود إلى البريد: ${email}`);
            return res.json({
                success: true,
                message: "✅ تم إرسال كود التحقق إلى البريد الإلكتروني",
                user, // 👈 إرجاع بيانات المستخدم كاملة هنا
            });
        } catch (error) {
            console.error("❌ فشل في إرسال كود عبر البريد:", error.message);
            return res.status(500).json({
                success: false,
                error: "❌ فشل في إرسال كود التحقق عبر البريد",
                details: error.message
            });
        }
    }
});














// export const resetPassword = asyncHandelr(async (req, res, next) => {
//     const { email, phone, otp, newPassword } = req.body;

//     if ((!email && !phone) || !otp || !newPassword) {
//         return next(new Error("❌ برجاء إدخال (إيميل أو رقم هاتف) + كود التحقق + كلمة المرور الجديدة", { cause: 400 }));
//     }

//     // 🔍 البحث عن المستخدم
//     const user = await Usermodel.findOne({
//         $or: [
//             ...(email ? [{ email }] : []),
//             ...(phone ? [{ phone }] : [])
//         ]
//     });

//     if (!user) return next(new Error("❌ المستخدم غير موجود", { cause: 404 }));

//     // ✅ في حالة المستخدم سجل بالبريد الإلكتروني
//     if (email) {
//         // تحقق من وجود الكود
//         if (!user.emailOTP) {
//             return next(new Error("❌ لم يتم إرسال كود تحقق لهذا الحساب", { cause: 400 }));
//         }

//         // تحقق من انتهاء الصلاحية
//         if (Date.now() > new Date(user.otpExpiresAt).getTime()) {
//             return next(new Error("❌ انتهت صلاحية كود التحقق", { cause: 400 }));
//         }

//         // تحقق من عدد المحاولات الفاشلة
//         if (user.blockUntil && Date.now() < new Date(user.blockUntil).getTime()) {
//             const remaining = Math.ceil((new Date(user.blockUntil).getTime() - Date.now()) / 1000);
//             return next(new Error(`🚫 تم حظرك مؤقتًا، حاول بعد ${remaining} ثانية`, { cause: 429 }));
//         }

//         // تحقق من الكود فعليًا
//         const isValidOTP = await comparehash({
//             planText: `${otp}`,
//             valuehash: user.emailOTP,
//         });

//         if (!isValidOTP) {
//             const attempts = (user.attemptCount || 0) + 1;

//             if (attempts >= 5) {
//                 await Usermodel.updateOne({ email }, {
//                     blockUntil: new Date(Date.now() + 2 * 60 * 1000), // حظر دقيقتين
//                     attemptCount: 0
//                 });
//                 return next(new Error("🚫 تم حظرك مؤقتًا بعد محاولات خاطئة كثيرة", { cause: 429 }));
//             }

//             await Usermodel.updateOne({ email }, { attemptCount: attempts });
//             return next(new Error("❌ كود التحقق غير صحيح", { cause: 400 }));
//         }

//         // ✅ الكود صحيح → تحديث الباسوورد
//         const hashedPassword = await generatehash({ planText: newPassword });
//         await Usermodel.updateOne(
//             { email },
//             {
//                 password: hashedPassword,
//                 $unset: {
//                     emailOTP: 0,
//                     otpExpiresAt: 0,
//                     attemptCount: 0,
//                     blockUntil: 0,
//                 },
//             }
//         );

//         return successresponse(res, "✅ تم تغيير كلمة المرور بنجاح عبر البريد الإلكتروني", 200);
//     }

//     // ✅ في حالة رقم الهاتف
//     if (phone) {
//         try {
//             const response = await axios.post(
//                 "https://api.authentica.sa/api/v1/verify-otp",
//                 { phone, otp },
//                 {
//                     headers: {
//                         "X-Authorization": process.env.AUTHENTICA_API_KEY,
//                         "Content-Type": "application/json",
//                         "Accept": "application/json",
//                     },
//                 }
//             );

//             if (response.data.status === true && response.data.message === "OTP verified successfully") {
//                 const hashedPassword = await generatehash({ planText: newPassword });

//                 await Usermodel.updateOne(
//                     { phone },
//                     {
//                         password: hashedPassword,
//                         isConfirmed: true,
//                         changeCredentialTime: Date.now(),
//                     }
//                 );

//                 return successresponse(res, "✅ تم إعادة تعيين كلمة المرور بنجاح عبر الهاتف", 200);
//             } else {
//                 return next(new Error("❌ كود التحقق غير صحيح أو منتهي الصلاحية", { cause: 400 }));
//             }
//         } catch (error) {
//             console.error("❌ فشل التحقق من OTP عبر Authentica:", error.response?.data || error.message);
//             return next(new Error("❌ فشل التحقق من OTP عبر الهاتف", { cause: 500 }));
//         }
//     }
// });













// export const signupServiceProvider = asyncHandelr(async (req, res, next) => {
//     const {
//         fullName,
//         password,
//         accountType,
//         email,
//         phone,
//         serviceType,
//     } = req.body;

//     // ✅ تحقق من وجود واحد من الاتنين فقط
//     if (!email && !phone) {
//         return next(new Error("يجب إدخال البريد الإلكتروني أو رقم الهاتف", { cause: 400 }));
//     }

//     // ✅ تحقق من وجود نوع الخدمة
//     if (!serviceType || !['Driver', 'Doctor', 'Host', 'Delivery'].includes(serviceType)) {
//         return next(new Error("نوع الخدمة غير صحيح أو مفقود", { cause: 400 }));
//     }

//     // ✅ تحقق من عدم تكرار الإيميل أو رقم الهاتف
//     const checkuser = await dbservice.findOne({
//         model: Usermodel,
//         filter: {
//             $or: [
//                 ...(email ? [{ email }] : []),
//                 ...(phone ? [{ phone }] : []),
//             ],
//         },
//     });

//     if (checkuser) {
//         if (checkuser.email === email) {
//             return next(new Error("البريد الإلكتروني مستخدم من قبل", { cause: 400 }));
//         }
//         if (checkuser.phone === phone) {
//             return next(new Error("رقم الهاتف مستخدم من قبل", { cause: 400 }));
//         }
//     }

//     // ✅ تشفير كلمة المرور
//     const hashpassword = await generatehash({ planText: password });

//     // ✅ رفع الملفات (من req.files)
//     const uploadedFiles = {};

//     const uploadToCloud = async (file, folder) => {
//         const isPDF = file.mimetype === "application/pdf";

//         const uploaded = await cloud.uploader.upload(file.path, {
//             folder,
//             resource_type: isPDF ? "raw" : "auto", // ← أهم نقطة هنا
//         });

//         return {
//             secure_url: uploaded.secure_url,
//             public_id: uploaded.public_id,
//         };
//     };

//     // صورة البطاقة
//     if (req.files?.nationalIdImage?.[0]) {
//         uploadedFiles.nationalIdImage = await uploadToCloud(req.files.nationalIdImage[0], `users/nationalIds`);
//     }

//     // رخصة القيادة
//     if (req.files?.driverLicenseImage?.[0]) {
//         uploadedFiles.driverLicenseImage = await uploadToCloud(req.files.driverLicenseImage[0], `users/driverLicenses`);
//     }

//     // رخصة العربية
//     if (req.files?.carLicenseImage?.[0]) {
//         uploadedFiles.carLicenseImage = await uploadToCloud(req.files.carLicenseImage[0], `users/carLicenses`);
//     }

//     // صور العربية
//     if (req.files?.carImages) {
//         uploadedFiles.carImages = [];
//         for (const file of req.files.carImages) {
//             const uploaded = await uploadToCloud(file, `users/carImages`);
//             uploadedFiles.carImages.push(uploaded);
//         }
//     }

//     // مستندات إضافية (بدون Array)
//     if (req.files?.additionalDocuments?.[0]) {
//         uploadedFiles.additionalDocuments = await uploadToCloud(req.files.additionalDocuments[0], `users/additionalDocs`);
//     }

//     // صورة البروفايل
//     if (req.files?.profiePicture?.[0]) {
//         uploadedFiles.profiePicture = await uploadToCloud(req.files.profiePicture[0], `users/profilePictures`);
//     }

//     // ✅ إنشاء المستخدم
//     const user = await dbservice.create({
//         model: Usermodel,
//         data: {
//             fullName,
//             password: hashpassword,
//             email,
//             phone,
//             accountType,
//             serviceType,
//             location: {
//                 type: "Point",
//                 coordinates: [
//                     req.body.longitude || 0,  // ← خط الطول
//                     req.body.latitude || 0    // ← خط العرض
//                 ]
//             },
//             ...uploadedFiles,
//         },
//     });

//     // ✅ إرسال OTP
//     try {
//         if (phone) {
//             await sendOTP(phone);
//             console.log(`📩 OTP تم إرساله إلى الهاتف: ${phone}`);
//         } else if (email) {
 
//     // }
//             const otp = customAlphabet("0123456789", 6)();

//             // 👇 قالب الإيميل
//             const html = vervicaionemailtemplet({ code: otp });

//             // 👇 تشفير الـ OTP قبل التخزين
//             const emailOTP = generatehash({ planText: `${otp}` });

//             // 👇 صلاحية الكود (10 دقائق)
//             const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

//             // 👇 تحديث بيانات الـ OTP في المستخدم
//             await Usermodel.updateOne(
//                 { _id: user._id },
//                 {
//                     emailOTP,
//                     otpExpiresAt,
//                     attemptCount: 0,
//                 }
//             );

//             // 👇 إرسال الإيميل
//             await sendemail({
//                 to: email,
//                 subject: "Confirm Email",
//                 text: "رمز التحقق الخاص بك",   // 👈 نص عادي عشان Brevo ما يشتكيش
//                 html,
//             });


//             console.log(`📩 OTP تم إرساله إلى البريد: ${email}`);
//         }
//     } catch (error) {
//         console.error("❌ فشل في إرسال OTP:", error.message);
//         return next(new Error("فشل في إرسال رمز التحقق", { cause: 500 }));
//     }
//     return successresponse(res, "تم إنشاء حساب مقدم الخدمة بنجاح، وتم إرسال رمز التحقق", 201);
// });








export const resetPassword = asyncHandelr(async (req, res, next) => {
    const { email, phone, otp, newPassword, accountType, serviceType } = req.body;

    if ((!email && !phone) || !otp || !newPassword) {
        return next(new Error("❌ برجاء إدخال (إيميل أو رقم هاتف) + كود التحقق + كلمة المرور الجديدة", { cause: 400 }));
    }

    let user;

    // ✅ تحديد المستخدم بدقة حسب نوع الحساب
    if (accountType === "User") {
        user = await Usermodel.findOne({
            $or: [
                ...(email ? [{ email, accountType: "User" }] : []),
                ...(phone ? [{ phone, accountType: "User" }] : []),
            ]
        });
    }
    else if (accountType === "ServiceProvider") {
        if (!serviceType) {
            return next(new Error("❌ يجب إدخال نوع الخدمة (serviceType) لمقدمي الخدمة", { cause: 400 }));
        }

        user = await Usermodel.findOne({
            $or: [
                ...(email ? [{ email, accountType: "ServiceProvider", serviceType }] : []),
                ...(phone ? [{ phone, accountType: "ServiceProvider", serviceType }] : []),
            ]
        });
    }
    else {
        return next(new Error("❌ نوع الحساب غير صحيح", { cause: 400 }));
    }

    if (!user) {
        const userAsServiceProvider = await Usermodel.findOne({ email, accountType: "ServiceProvider" });
        if (userAsServiceProvider) {
            return next(new Error("🚫 البريد يخص حساب مزود خدمة وليس مستخدم عادي", { cause: 400 }));
        }
        return next(new Error("❌ المستخدم غير موجود", { cause: 404 }));
    }

    // ✅ حالة الإيميل
    if (email) {
        if (user.accountType !== accountType) {
            return next(new Error("🚫 نوع الحساب المرسل لا يطابق نوع الحساب المسجل بالبريد", { cause: 400 }));
        }

        if (!user.emailOTP) {
            return next(new Error("❌ لم يتم إرسال كود تحقق لهذا الحساب", { cause: 400 }));
        }

        if (Date.now() > new Date(user.otpExpiresAt).getTime()) {
            return next(new Error("❌ انتهت صلاحية كود التحقق", { cause: 400 }));
        }

        const isValidOTP = await comparehash({ planText: `${otp}`, valuehash: user.emailOTP });

        if (!isValidOTP) {
            const attempts = (user.attemptCount || 0) + 1;
            if (attempts >= 5) {
                await Usermodel.updateOne({ email }, {
                    blockUntil: new Date(Date.now() + 2 * 60 * 1000),
                    attemptCount: 0
                });
                return next(new Error("🚫 تم حظرك مؤقتًا بعد محاولات خاطئة كثيرة", { cause: 429 }));
            }
            await Usermodel.updateOne({ email }, { attemptCount: attempts });
            return next(new Error("❌ كود التحقق غير صحيح", { cause: 400 }));
        }

        const hashedPassword = await generatehash({ planText: newPassword });
        await Usermodel.updateOne(
            { _id: user._id },
            {
                password: hashedPassword,
                $unset: {
                    emailOTP: 0,
                    otpExpiresAt: 0,
                    attemptCount: 0,
                    blockUntil: 0,
                },
            }
        );

        return successresponse(res, "✅ تم تغيير كلمة المرور بنجاح عبر البريد الإلكتروني", 200);
    }

    // ✅ حالة الهاتف (مع فلترة دقيقة حسب نوع الحساب)
    if (phone) {
        try {
            // ✅ التحقق من OTP عبر RapidAPI (Authentica)
            const response = await verifyOTP(phone, otp);

            if (response?.status === true || response?.message?.includes("verified")) {
                const hashedPassword = await generatehash({ planText: newPassword });

                const filter = { phone, accountType };
                if (accountType === "ServiceProvider" && serviceType) {
                    filter.serviceType = serviceType;
                }

                await Usermodel.updateOne(
                    filter,
                    {
                        password: hashedPassword,
                        isConfirmed: true,
                        changeCredentialTime: Date.now(),
                    }
                );

                return successresponse(res, "✅ تم إعادة تعيين كلمة المرور بنجاح عبر الهاتف", 200);
            } else {
                return next(new Error("❌ كود التحقق غير صحيح أو منتهي الصلاحية", { cause: 400 }));
            }
        } catch (error) {
            console.error("❌ فشل التحقق من OTP عبر Authentica:", error.response?.data || error.message);
            return next(new Error("❌ فشل التحقق من OTP عبر الهاتف", { cause: 500 }));
        }
    }
});
    




// import cron from 'node-cron';




// cron.schedule('0 * * * *', async () => {
//     console.log('🔄 جاري التحقق من أسماء المستخدمين المنتهية...');

//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     const result = await Usermodel.updateMany(
//         {
//             lastUsernameUpdate: { $lte: twentyFourHoursAgo },
//             username: { $ne: null } // فقط اللي عندهم اسم حاليًا
//         },
//         {
//             $set: { username: null },
//             $unset: { lastUsernameUpdate: "" } // اختياري: حذف التاريخ
//         }
//     );

//     console.log(`🗑️ تم حذف اسم ${result.modifiedCount} مستخدم(ين)`);
// });



import cron from 'node-cron';

// تشغيل كل ساعة (في الدقيقة 0 من كل ساعة)
cron.schedule('0 * * * *', async () => {
    console.log('🔄 جاري التحقق من أسماء المستخدمين المنتهية...');

    // بعد 24 ساعة كاملة من آخر تحديث
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await Usermodel.updateMany(
        {
            lastUsernameUpdate: { $lte: twentyFourHoursAgo },
            username: { $ne: null }, // فقط اللي عندهم اسم حاليًا
            role: "User" // فقط المستخدمين العاديين (مش Admin أو Owner)
        },
        {
            $set: { username: null },
            $unset: { lastUsernameUpdate: "" } // حذف التاريخ اختياري
        }
    );

    console.log(`🗑️ تم حذف اسم ${result.modifiedCount} مستخدم(ين) عادي(ين)`);
});

export const updateUserProfile = asyncHandelr(async (req, res) => {
    const { username, ImageId } = req.body;

    // التأكد من وجود المستخدم من التوكن (افترض أنك تستخدم middleware auth)
    const user = req.user; // يأتي من middleware مثل protect

    if (!user) {
        return res.status(401).json({
            message: "❌ غير مصرح لك",
        });
    }

    // تحديث الحقول إذا تم إرسالها
    if (username !== undefined) {
        // يمكنك إضافة شروط مثل: لا يسمح بأسماء فارغة، أو تحقق من التكرار (اختياري)
        if (username.trim() === '') {
            return res.status(400).json({
                message: "❌ اسم المستخدم لا يمكن أن يكون فارغًا",
            });
        }

        user.username = username.trim();
        user.lastUsernameUpdate = new Date(); // تسجيل وقت التحديث
    }

    if (ImageId !== undefined) {
        // التأكد من أن ImageId صالح (اختياري: تحقق من وجوده في CartoonImage)
        user.ImageId = ImageId || null;
    }

    await user.save();

    return res.status(200).json({
        message: "✅ تم تحديث الملف الشخصي بنجاح",
        data: {
            _id: user._id,
            username: user.username,
            ImageId: user.ImageId,
            email: user.email,
            phone: user.phone,
            // أي بيانات أخرى تريدها
        }
    });
});











// export const getUserProfile = asyncHandelr(async (req, res) => {
//     const user = req.user; // يأتي من middleware protect

//     if (!user) {
//         return res.status(401).json({ message: "❌ غير مصرح لك" });
//     }

//     // حساب الوقت المتبقي للاسم (لو موجود)
//     let usernameExpiryInfo = null;

//     if (user.lastUsernameUpdate && user.username) {
//         const lastUpdate = new Date(user.lastUsernameUpdate);
//         const now = new Date();
//         const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60); // بالساعات
//         const hoursLeft = 24 - hoursPassed;

//         if (hoursLeft > 0) {
//             const fullHours = Math.floor(hoursLeft);
//             const minutes = Math.round((hoursLeft - fullHours) * 60);

//             usernameExpiryInfo = {
//                 lastUpdatedAt: user.lastUsernameUpdate,
//                 expiresIn: `${fullHours} ساعة و ${minutes} دقيقة`,
//                 hoursLeft: Math.round(hoursLeft * 100) / 100, // بدقة عشرية
//                 status: "active"
//             };
//         } else {
//             // لو مر أكثر من 24 ساعة
//             usernameExpiryInfo = {
//                 lastUpdatedAt: user.lastUsernameUpdate,
//                 expiresIn: "انتهت الصلاحية",
//                 hoursLeft: 0,
//                 status: "expired"
//             };
//         }
//     }

//     // populate الصورة الكرتونية لو موجودة
//     await user.populate({
//         path: 'ImageId',
//         select: 'image.secure_url image.public_id'
//     });

//     res.status(200).json({
//         message: "✅ تم جلب بيانات الملف الشخصي بنجاح",
//         profile: {
//             _id: user._id,
//             username: user.username || null,
//             email: user.email,
//             phone: user.phone,
//             role: user.role,
//             ImageId: user.ImageId,
//             isOnline: user.isOnline,
//             createdAt: user.createdAt,
//             // معلومات الاسم المؤقت
//             usernameExpiry: usernameExpiryInfo
//         }
//     });
// });
 

export const getUserProfile = asyncHandelr(async (req, res) => {
    const user = req.user; // يأتي من middleware protect

    if (!user) {
        return res.status(401).json({ message: "❌ غير مصرح لك" });
    }

    // حساب الوقت المتبقي للاسم (لو موجود)
    let usernameExpiryInfo = null;

    // فقط للمستخدمين العاديين (User) نحسب الوقت المتبقي
    if (user.role === "User" && user.lastUsernameUpdate && user.username) {
        const lastUpdate = new Date(user.lastUsernameUpdate);
        const now = new Date();
        const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60); // بالساعات
        const hoursLeft = 24 - hoursPassed;

        if (hoursLeft > 0) {
            const fullHours = Math.floor(hoursLeft);
            const minutes = Math.round((hoursLeft - fullHours) * 60);

            usernameExpiryInfo = {
                lastUpdatedAt: user.lastUsernameUpdate,
                expiresIn: `${fullHours} ساعة و ${minutes} دقيقة`,
                hoursLeft: Math.round(hoursLeft * 100) / 100,
                status: "active"
            };
        }
        // لو مر أكثر من 24 ساعة → null (مش object)
        // else { usernameExpiryInfo remains null }
    }

    // populate الصورة الكرتونية لو موجودة
    await user.populate({
        path: 'ImageId',
        select: 'image.secure_url image.public_id'
    });

    // بناء الـ response
    const profileResponse = {
        _id: user._id,
        username: user.username || null,
        email: user.email,
        phone: user.phone,
        role: user.role,
        ImageId: user.ImageId,
        isOnline: user.isOnline,
        createdAt: user.createdAt,
    };

    // إضافة usernameExpiry فقط لو كان User ولسه الاسم فعال
    if (user.role === "User" && usernameExpiryInfo) {
        profileResponse.usernameExpiry = usernameExpiryInfo;
    }
    // لو Admin أو Owner أو انتهت الصلاحية → مش هيضيف usernameExpiry خالص

    res.status(200).json({
        message: "✅ تم جلب بيانات الملف الشخصي بنجاح",
        profile: profileResponse
    });
});

export const createPost = asyncHandelr(async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: "❌ النص مطلوب" });
    }

    // ✅ التحقق من وجود username
    // ✅ التحقق من وجود username
    if (!req.user.username || req.user.username === null || req.user.username.trim() === '') {
        return res.status(201).json({  // 403 أفضل من 404 هنا لأنه مشكلة صلاحية
            message: "المستخدم expired"
        });
    }

    // ✅ تحديد حالة البوست حسب الدور
    let status = "pending"; // افتراضي للمستخدم العادي
    if (req.user.role === "Admin" || req.user.role === "Owner") {
        status = "accepted"; // قبول فوري للأدمن والمالك
    }

    const post = await Posttt.create({
        text: text.trim(),
        user: req.user._id,
        status // ← ياخد القيمة المناسبة حسب الدور
    });

    // رسالة مخصصة حسب الحالة
    const message = status === "accepted"
        ? "✅ تم نشر البوست بنجاح مباشرة"
        : "✅ تم إنشاء البوست بنجاح (في انتظار الموافقة)";

    res.status(201).json({
        message,
        data: post
    });
});
 









export const addComment = asyncHandelr(async (req, res) => {
    const { text } = req.body;
    const { postId } = req.params;

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: "❌ نص التعليق مطلوب" });
    }

    const post = await Posttt.findById(postId)
        .populate({
            path: 'user',
            select: 'fcmToken lang username'
        });

    if (!post) {
        return res.status(404).json({ message: "❌ البوست غير موجود" });
    }

    // إنشاء الكومنت الرئيسي
    const comment = await Commenttt.create({
        text: text.trim(),
        user: req.user._id,
        parentComment: null
    });

    // إضافته للبوست
    post.comments.push(comment._id);
    await post.save();

    await comment.populate('user', 'username ImageId');

    // ✅ إرسال إشعار لصاحب البوست (لو مش هو نفسه اللي علق)
    if (post.user && post.user._id.toString() !== req.user._id.toString()) {
        const userLang = post.user.lang || "ar";

        const titles = {
            ar: "💬 تعليق جديد على بوستك!",
            en: "💬 New comment on your post!"
        };

        const bodies = {
            ar: `${req.user.username || "شخص ما"} علق على بوستك: "${text.trim()}"`,
            en: `${req.user.username || "Someone"} commented on your post: "${text.trim()}"`
        };

        const title = titles[userLang];
        const body = bodies[userLang];

        // ✅ تخزين الإشعار أولاً
        try {
            await NotificationModell.create({
                userId: post.user._id,
                postId: post._id,
                commentId: comment._id,
                title: {
                    ar: titles.ar,
                    en: titles.en
                },
                body: {
                    ar: bodies.ar,
                    en: bodies.en
                },
                type: "comment",
                deviceToken: post.user.fcmToken || null,
                data: {
                    postId: post._id.toString(),
                    commentId: comment._id.toString(),
                    commenterUsername: req.user.username || "Someone"
                }
            });

            console.log(`✅ تم تخزين إشعار تعليق جديد للمستخدم ${post.user._id}`);
        } catch (storeError) {
            console.error("❌ فشل تخزين إشعار التعليق:", storeError.message);
        }

        // ✅ إرسال الإشعار لو في توكن
        if (post.user.fcmToken) {
            try {
                await admin.messaging().send({
                    notification: { title, body },
                    data: {
                        postId: post._id.toString(),
                        commentId: comment._id.toString(),
                        type: "comment"
                    },
                    token: post.user.fcmToken,
                });

                console.log(`✅ تم إرسال إشعار تعليق جديد (${userLang})`);
            } catch (sendError) {
                console.error("❌ فشل إرسال إشعار التعليق:", sendError.message);

                if (sendError.message.includes("Requested entity was not found") ||
                    sendError.message.includes("The registration token is not a valid FCM registration token")) {

                    console.log(`🗑️ توكن FCM باطل، جاري حذفه من المستخدم ${post.user._id}`);

                    post.user.fcmToken = null;
                    await post.user.save();
                }
            }
        } else {
            console.log(`⚠️ لا يوجد fcmToken لصاحب البوست، الإشعار مخزن فقط`);
        }
    }

    res.status(201).json({
        message: "✅ تم إضافة التعليق بنجاح",
        data: comment
    });
});







export const reactToPost = asyncHandelr(async (req, res) => {
    const { type } = req.body;
    const { postId } = req.params;

    if (!["like", "love", "sad", "angry"].includes(type)) {
        return res.status(400).json({ message: "❌ نوع الـ reaction غير صالح" });
    }

    const post = await Posttt.findById(postId)
        .populate({
            path: 'user',
            select: 'fcmToken lang username'
        });

    if (!post) {
        return res.status(404).json({ message: "❌ البوست غير موجود" });
    }

    // البحث عن reaction موجود من نفس المستخدم ونفس النوع
    const existingReactionIndex = post.reactions.findIndex(
        r => r.user.toString() === req.user._id.toString() && r.type === type
    );

    let action = "added";

    if (existingReactionIndex !== -1) {
        post.reactions.splice(existingReactionIndex, 1);
        action = "removed";
        await post.save();

        return res.json({
            message: "❌ تم إلغاء الـ reaction",
            data: { type }
        });
    }

    post.reactions = post.reactions.filter(
        r => r.user.toString() !== req.user._id.toString()
    );

    post.reactions.push({
        user: req.user._id,
        type
    });

    await post.save();

    // ✅ إرسال إشعار + تخزينه (فقط لما يضيف reaction جديد)
    if (action === "added" && post.user._id.toString() !== req.user._id.toString()) { // ما تبعتش إشعار لنفسك
        const userLang = post.user.lang || "ar";

        const titles = {
            ar: "👍 تفاعل جديد على بوستك!",
            en: "👍 New reaction on your post!"
        };

        const reactionWords = {
            like: { ar: "إعجاب", en: "like" },
            love: { ar: "حب", en: "love" },
            sad: { ar: "حزن", en: "sad" },
            angry: { ar: "غضب", en: "angry" }
        };

        const bodies = {
            ar: `${req.user.username || "شخص ما"} قام بـ ${reactionWords[type].ar} على بوستك`,
            en: `${req.user.username || "Someone"} ${reactionWords[type].en}d your post`
        };

        const title = titles[userLang];
        const body = bodies[userLang];

        // ✅ تخزين الإشعار أولاً (دايمًا، حتى لو التوكن باطل)
        try {
            await NotificationModell.create({
                userId: post.user._id,
                postId: post._id,
                title: {
                    ar: titles.ar,
                    en: titles.en
                },
                body: {
                    ar: bodies.ar,
                    en: bodies.en
                },
                type: "reaction",
                deviceToken: post.user.fcmToken || null,
                data: {
                    postId: post._id.toString(),
                    reactorUsername: req.user.username || "Someone"
                }
            });

            console.log(`✅ تم تخزين إشعار reaction للمستخدم ${post.user._id}`);
        } catch (storeError) {
            console.error("❌ فشل تخزين الإشعار في الداتابيز:", storeError.message);
        }

        // ✅ محاولة إرسال الإشعار (لو في توكن)
        if (post.user.fcmToken) {
            try {
                await admin.messaging().send({
                    notification: { title, body },
                    data: {
                        postId: post._id.toString(),
                        type: "reaction"
                    },
                    token: post.user.fcmToken,
                });

                console.log(`✅ تم إرسال إشعار reaction (${userLang}) إلى ${post.user.username}`);
            } catch (sendError) {
                console.error("❌ فشل إرسال إشعار الـ reaction:", sendError.message);

                if (sendError.message.includes("Requested entity was not found") ||
                    sendError.message.includes("The registration token is not a valid FCM registration token")) {

                    console.log(`🗑️ توكن FCM باطل، جاري حذفه من المستخدم ${post.user._id}`);

                    post.user.fcmToken = null;
                    await post.user.save();
                }
            }
        } else {
            console.log(`⚠️ لا يوجد fcmToken للمستخدم ${post.user._id}، الإشعار مخزن فقط`);
        }
    }

    res.json({
        message: `✅ تم إضافة ${type} بنجاح`,
        data: { type }
    });
});





export const changeUserLanguage = asyncHandelr(async (req, res) => {
    const { lang } = req.body;

    // اللغات المسموحة
    const allowedLanguages = ["ar", "en"];
    if (!lang || !allowedLanguages.includes(lang.toLowerCase())) {
        return res.status(400).json({
            message: "❌ اللغة غير صالحة. يجب أن تكون 'ar' أو 'en'"
        });
    }

    const user = req.user; // من middleware protect

    user.lang = lang.toLowerCase();
    await user.save();

    res.status(200).json({
        message: "✅ تم تغيير اللغة بنجاح",
        language: user.lang,
        profile: {
            _id: user._id,
            username: user.username,
            email: user.email,
            lang: user.lang
        }
    });
});


export const GetMyNotifications = asyncHandelr(async (req, res) => {
    const userId = req.user._id;

    const notifications = await NotificationModell.find({ userId })
        .sort({ createdAt: -1 }) // الأحدث أولاً
        .select('title type body isRead createdAt postId'); // نختار الحقول المفيدة

    // اختياري: تحديث الإشعارات كـ مقروءة (unread → read)
    // لو عايز تعمل ده، ألغي التعليق من السطرين دول:
    // await NotificationModell.updateMany(
    //     { userId, isRead: false },
    //     { isRead: true }
    // );

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.status(200).json({
        message: notifications.length
            ? "✅ تم جلب إشعاراتك بنجاح"
            : "📭 لا توجد إشعارات حاليًا",
        count: notifications.length,
        unreadCount,
        notifications
    });
});

// export const getMyPosts = asyncHandelr(async (req, res) => {
//     const posts = await Posttt.find({
//         user: req.user._id,
//         status: "accepted"  // ← الإضافة الجديدة
//     })
//         .sort({ createdAt: -1 })
//         .populate('user', 'username ImageId')
//         .populate('reactions.user', 'username ImageId')
//         .populate({
//             path: 'comments',
//             populate: {
//                 path: 'user reactions.user',
//                 select: 'username ImageId'
//             }
//         })
//         .lean(); // مهم: عشان نقدر نعدل بحرية

//     // جمع IDs التعليقات الرئيسية
//     const mainCommentIds = posts
//         .flatMap(p => p.comments || [])
//         .map(c => c._id.toString());

//     // جلب كل الردود المتداخلة
//     const allReplies = await Commenttt.find({
//         parentComment: { $in: mainCommentIds }
//     })
//         .populate('user', 'username ImageId')
//         .populate('reactions.user', 'username ImageId')
//         .lean();

//     // بناء الشجرة
//     const buildReplies = (parentId) => {
//         return allReplies
//             .filter(r => r.parentComment?.toString() === parentId)
//             .map(r => ({
//                 ...r,
//                 replies: buildReplies(r._id.toString())
//             }));
//     };

//     // إضافة replies للتعليقات الرئيسية
//     posts.forEach(post => {
//         post.comments = (post.comments || []).map(comment => ({
//             ...comment,
//             replies: buildReplies(comment._id.toString())
//         }));
//     });

//     // الإحصائيات
//     const formattedPosts = posts.map(post => {
//         const reactionsCount = { like: 0, love: 0, sad: 0, angry: 0, total: post.reactions.length };
//         post.reactions.forEach(r => reactionsCount[r.type]++);

//         const countAllComments = (comments) => {
//             return comments.reduce((sum, c) => sum + 1 + countAllComments(c.replies || []), 0);
//         };

//         return {
//             ...post,
//             reactionsCount,
//             commentsCount: countAllComments(post.comments || [])
//         };
//     });

//     res.json({
//         message: "✅ تم جلب بوستاتك بنجاح",
//         count: formattedPosts.length,
//         data: formattedPosts
//     });
// });






export const getMyPosts = asyncHandelr(async (req, res) => {
    // ✅ إضافة Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // جلب عدد البوستات الكلي للمستخدم (للـ pagination info)
    const totalPosts = await Posttt.countDocuments({
        user: req.user._id,
        status: "accepted"
    });

    const posts = await Posttt.find({
        user: req.user._id,
        status: "accepted"
    })
        .sort({ createdAt: -1 })
        .skip(skip)        // ← جديد: تخطي البوستات السابقة
        .limit(limit)      // ← جديد: حد أقصى لعدد البوستات في الصفحة
        .populate('user', 'username ImageId')
        .populate('reactions.user', 'username ImageId')
        .populate({
            path: 'comments',
            populate: {
                path: 'user reactions.user',
                select: 'username ImageId'
            }
        })
        .lean();

    // جمع IDs التعليقات الرئيسية
    const mainCommentIds = posts
        .flatMap(p => p.comments || [])
        .map(c => c._id.toString());

    // جلب كل الردود المتداخلة
    const allReplies = await Commenttt.find({
        parentComment: { $in: mainCommentIds }
    })
        .populate('user', 'username ImageId')
        .populate('reactions.user', 'username ImageId')
        .lean();

    // بناء الشجرة
    const buildReplies = (parentId) => {
        return allReplies
            .filter(r => r.parentComment?.toString() === parentId)
            .map(r => ({
                ...r,
                replies: buildReplies(r._id.toString())
            }));
    };

    // إضافة replies للتعليقات الرئيسية
    posts.forEach(post => {
        post.comments = (post.comments || []).map(comment => ({
            ...comment,
            replies: buildReplies(comment._id.toString())
        }));
    });

    // الإحصائيات
    const formattedPosts = posts.map(post => {
        const reactionsCount = { like: 0, love: 0, sad: 0, angry: 0, total: post.reactions.length };
        post.reactions.forEach(r => reactionsCount[r.type]++);

        const countAllComments = (comments) => {
            return comments.reduce((sum, c) => sum + 1 + countAllComments(c.replies || []), 0);
        };

        return {
            ...post,
            reactionsCount,
            commentsCount: countAllComments(post.comments || [])
        };
    });

    // ✅ معلومات الـ Pagination في الـ response
    const totalPages = Math.ceil(totalPosts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
        message: "✅ تم جلب بوستاتك بنجاح",
        count: formattedPosts.length,
        totalPosts,
        pagination: {
            currentPage: page,
            totalPages,
            hasNextPage,
            hasPrevPage,
            limit
        },
        data: formattedPosts
    });
});






// export const getAllPosts = asyncHandelr(async (req, res) => {
//     // دالة مساعدة لحساب reactionsCount
//     const calculateReactionsCount = (reactions = []) => {
//         const count = { like: 0, love: 0, sad: 0, angry: 0, total: reactions.length };
//         reactions.forEach(r => {
//             if (count.hasOwnProperty(r.type)) {
//                 count[r.type]++;
//             }
//         });
//         return count;
//     };

//     const posts = await Posttt.find({ status: "accepted" })
//         .sort({ createdAt: -1 })
//         // populate صاحب البوست مع صورته الكرتونية
//         .populate({
//             path: 'user',
//             select: 'username ImageId',
//             populate: {
//                 path: 'ImageId',
//                 select: 'image.secure_url image.public_id'
//             }
//         })
//         // populate reactions البوست مع صور المستخدمين
//         .populate({
//             path: 'reactions.user',
//             select: 'username ImageId',
//             populate: {
//                 path: 'ImageId',
//                 select: 'image.secure_url image.public_id'
//             }
//         })
//         // populate التعليقات الرئيسية
//         .populate({
//             path: 'comments',
//             populate: [
//                 // صاحب الكومنت + صورته
//                 {
//                     path: 'user',
//                     select: 'username ImageId',
//                     populate: {
//                         path: 'ImageId',
//                         select: 'image.secure_url image.public_id'
//                     }
//                 },
//                 // reactions الكومنت + صور أصحابها
//                 {
//                     path: 'reactions.user',
//                     select: 'username ImageId',
//                     populate: {
//                         path: 'ImageId',
//                         select: 'image.secure_url image.public_id'
//                     }
//                 }
//             ]
//         })
//         .lean();

//     // جمع IDs التعليقات الرئيسية
//     const mainCommentIds = posts
//         .flatMap(p => p.comments || [])
//         .map(c => c._id.toString());

//     // جلب كل الردود المتداخلة مع populate كامل لليوزر والصور
//     const allReplies = await Commenttt.find({
//         parentComment: { $in: mainCommentIds }
//     })
//         .populate({
//             path: 'user',
//             select: 'username ImageId',
//             populate: {
//                 path: 'ImageId',
//                 select: 'image.secure_url image.public_id'
//             }
//         })
//         .populate({
//             path: 'reactions.user',
//             select: 'username ImageId',
//             populate: {
//                 path: 'ImageId',
//                 select: 'image.secure_url image.public_id'
//             }
//         })
//         .lean();

//     // بناء الشجرة للردود
//     const buildReplies = (parentId) => {
//         return allReplies
//             .filter(r => r.parentComment?.toString() === parentId)
//             .map(r => ({
//                 ...r,
//                 reactionsCount: calculateReactionsCount(r.reactions || []),
//                 replies: buildReplies(r._id.toString())
//             }));
//     };

//     // إضافة replies و reactionsCount للتعليقات الرئيسية
//     posts.forEach(post => {
//         post.comments = (post.comments || []).map(comment => ({
//             ...comment,
//             reactionsCount: calculateReactionsCount(comment.reactions || []),
//             replies: buildReplies(comment._id.toString())
//         }));
//     });

//     // تنسيق البوستات النهائي
//     const formattedPosts = posts.map(post => {
//         const reactionsCount = calculateReactionsCount(post.reactions || []);

//         const countAllComments = (comments) => {
//             return comments.reduce((sum, c) => sum + 1 + countAllComments(c.replies || []), 0);
//         };

//         return {
//             ...post,
//             reactionsCount,
//             commentsCount: countAllComments(post.comments || [])
//         };
//     });

//     res.json({
//         message: "✅ تم جلب جميع البوستات بنجاح",
//         count: formattedPosts.length,
//         data: formattedPosts
//     });
// });



export const getAllPosts = asyncHandelr(async (req, res) => {
    // دالة مساعدة لحساب reactionsCount
    const calculateReactionsCount = (reactions = []) => {
        const count = { like: 0, love: 0, sad: 0, angry: 0, total: reactions.length };
        reactions.forEach(r => {
            if (count.hasOwnProperty(r.type)) {
                count[r.type]++;
            }
        });
        return count;
    };

    // ✅ إضافة Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // جلب عدد البوستات الكلي (للـ pagination info)
    const totalPosts = await Posttt.countDocuments({ status: "accepted" });

    const posts = await Posttt.find({ status: "accepted" })
        .sort({ createdAt: -1 })
        .skip(skip)        // ← جديد: pagination
        .limit(limit)      // ← جديد: pagination
        // populate صاحب البوست مع صورته الكرتونية
        .populate({
            path: 'user',
            select: 'username ImageId',
            populate: {
                path: 'ImageId',
                select: 'image.secure_url image.public_id'
            }
        })
        // populate reactions البوست مع صور المستخدمين
        .populate({
            path: 'reactions.user',
            select: 'username ImageId',
            populate: {
                path: 'ImageId',
                select: 'image.secure_url image.public_id'
            }
        })
        // populate التعليقات الرئيسية
        .populate({
            path: 'comments',
            populate: [
                // صاحب الكومنت + صورته
                {
                    path: 'user',
                    select: 'username ImageId',
                    populate: {
                        path: 'ImageId',
                        select: 'image.secure_url image.public_id'
                    }
                },
                // reactions الكومنت + صور أصحابها
                {
                    path: 'reactions.user',
                    select: 'username ImageId',
                    populate: {
                        path: 'ImageId',
                        select: 'image.secure_url image.public_id'
                    }
                }
            ]
        })
        .lean();

    // جمع IDs التعليقات الرئيسية
    const mainCommentIds = posts
        .flatMap(p => p.comments || [])
        .map(c => c._id.toString());

    // جلب كل الردود المتداخلة مع populate كامل لليوزر والصور
    const allReplies = await Commenttt.find({
        parentComment: { $in: mainCommentIds }
    })
        .populate({
            path: 'user',
            select: 'username ImageId',
            populate: {
                path: 'ImageId',
                select: 'image.secure_url image.public_id'
            }
        })
        .populate({
            path: 'reactions.user',
            select: 'username ImageId',
            populate: {
                path: 'ImageId',
                select: 'image.secure_url image.public_id'
            }
        })
        .lean();

    // بناء الشجرة للردود
    const buildReplies = (parentId) => {
        return allReplies
            .filter(r => r.parentComment?.toString() === parentId)
            .map(r => ({
                ...r,
                reactionsCount: calculateReactionsCount(r.reactions || []),
                replies: buildReplies(r._id.toString())
            }));
    };

    // إضافة replies و reactionsCount للتعليقات الرئيسية
    posts.forEach(post => {
        post.comments = (post.comments || []).map(comment => ({
            ...comment,
            reactionsCount: calculateReactionsCount(comment.reactions || []),
            replies: buildReplies(comment._id.toString())
        }));
    });

    // تنسيق البوستات النهائي
    const formattedPosts = posts.map(post => {
        const reactionsCount = calculateReactionsCount(post.reactions || []);

        const countAllComments = (comments) => {
            return comments.reduce((sum, c) => sum + 1 + countAllComments(c.replies || []), 0);
        };

        return {
            ...post,
            reactionsCount,
            commentsCount: countAllComments(post.comments || [])
        };
    });

    // ✅ معلومات الـ Pagination
    const totalPages = Math.ceil(totalPosts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
        message: "✅ تم جلب جميع البوستات بنجاح",
        count: formattedPosts.length,
        totalPosts,
        pagination: {
            currentPage: page,
            totalPages,
            hasNextPage,
            hasPrevPage,
            limit
        },
        data: formattedPosts
    });
});




export const MarkAllNotificationsAsRead = asyncHandelr(async (req, res) => {
    const userId = req.user._id;

    // تحديث كل الإشعارات غير المقروءة للمستخدم
    const result = await NotificationModell.updateMany(
        {
            userId,
            isRead: false
        },
        {
            isRead: true
        }
    );

    if (result.modifiedCount === 0) {
        return res.status(200).json({
            message: "📭 لا توجد إشعارات غير مقروءة"
        });
    }

    res.status(200).json({
        message: `✅ تم تعليم ${result.modifiedCount} إشعار(ات) كمقروءة بنجاح`,
        markedAsRead: result.modifiedCount
    });
});



// controllers/postController.js


// @desc    جلب البوستات اللي حالتها pending فقط (بيانات بسيطة بدون كومنتات أو لايكات)
// @route   GET /api/posts/pending
// @access  Private (Admin) أو Public لو عايز، لكن موصى بـ Admin
export const getPendingPosts = asyncHandelr(async (req, res) => {
    // اختياري: تحقق من صلاحية الأدمن
    // if (req.user.role !== "Admin" && req.user.role !== "Owner") {
    //     return res.status(403).json({ message: "❌ غير مصرح لك" });
    // }

    const pendingPosts = await Posttt.find({ status: "pending" })
        .sort({ createdAt: -1 }) // الأحدث أولاً
        .populate({
            path: 'user',
            select: 'username ImageId',
            populate: {
                path: 'ImageId',
                select: 'image.secure_url image.public_id'
            }
        })
        .select('text status createdAt user') // فقط الحقول اللي عايزها
        .lean(); // للأداء

    res.status(200).json({
        message: pendingPosts.length
            ? "✅ تم جلب البوستات المعلقة بنجاح"
            : "📭 لا توجد بوستات في انتظار الموافقة حاليًا",
        count: pendingPosts.length,
        data: pendingPosts
    });
});



export const replyToComment = asyncHandelr(async (req, res) => {
    const { text } = req.body;
    const { commentId } = req.params;

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: "❌ نص الرد مطلوب" });
    }

    // التأكد من وجود الكومنت الأب
    const parentComment = await Commenttt.findById(commentId);
    if (!parentComment) {
        return res.status(404).json({ message: "❌ الكومنت الأصلي غير موجود" });
    }

    // إنشاء الرد الجديد مع ربطه بالكومنت الأب
    const reply = await Commenttt.create({
        text: text.trim(),
        user: req.user._id,
        parentComment: commentId  // هنا الفرق: مش null
    });

    // Populate بيانات المستخدم في الرد مباشرة
    await reply.populate('user', 'username ImageId');

    res.status(201).json({
        message: "✅ تم إضافة الرد بنجاح",
        data: reply
    });
});




// export const reactToComment = asyncHandelr(async (req, res) => {
//     const { type } = req.body;
//     const { commentId } = req.params;

//     if (!["like", "love", "sad", "angry"].includes(type)) {
//         return res.status(400).json({ message: "❌ نوع الـ reaction غير صالح" });
//     }

//     const comment = await Commenttt.findById(commentId);
//     if (!comment) {
//         return res.status(404).json({ message: "❌ الكومنت غير موجود" });
//     }

//     // البحث عن reaction موجود من نفس المستخدم ونفس النوع
//     const existingReactionIndex = comment.reactions.findIndex(
//         r => r.user.toString() === req.user._id.toString() && r.type === type
//     );

//     // لو موجود → إلغاء الـ reaction
//     if (existingReactionIndex !== -1) {
//         comment.reactions.splice(existingReactionIndex, 1);
//         await comment.save();
//         return res.json({
//             message: "❌ تم إلغاء الـ reaction",
//             data: { type }
//         });
//     }

//     // إزالة أي reaction قديم من نفس المستخدم (عشان يغير النوع فقط)
//     comment.reactions = comment.reactions.filter(
//         r => r.user.toString() !== req.user._id.toString()
//     );

//     // إضافة الـ reaction الجديد
//     comment.reactions.push({
//         user: req.user._id,
//         type
//     });

//     await comment.save();

//     res.json({
//         message: `✅ تم إضافة ${type} بنجاح`,
//         data: { type }
//     });
// });









export const reactToComment = asyncHandelr(async (req, res) => {
    const { type } = req.body;
    const { commentId } = req.params;

    if (!["like", "love", "sad", "angry"].includes(type)) {
        return res.status(400).json({ message: "❌ نوع الـ reaction غير صالح" });
    }

    const comment = await Commenttt.findById(commentId)
        .populate({
            path: 'user',
            select: 'fcmToken lang username'
        });

    if (!comment) {
        return res.status(404).json({ message: "❌ الكومنت غير موجود" });
    }

    // البحث عن reaction موجود من نفس المستخدم ونفس النوع
    const existingReactionIndex = comment.reactions.findIndex(
        r => r.user.toString() === req.user._id.toString() && r.type === type
    );

    let action = "added";

    if (existingReactionIndex !== -1) {
        comment.reactions.splice(existingReactionIndex, 1);
        action = "removed";
        await comment.save();

        return res.json({
            message: "❌ تم إلغاء الـ reaction",
            data: { type }
        });
    }

    comment.reactions = comment.reactions.filter(
        r => r.user.toString() !== req.user._id.toString()
    );

    comment.reactions.push({
        user: req.user._id,
        type
    });

    await comment.save();

    // ✅ إرسال إشعار + تخزينه (فقط لما يضيف reaction جديد)
    if (action === "added" && comment.user._id.toString() !== req.user._id.toString()) {
        const userLang = comment.user.lang || "ar";

        const titles = {
            ar: "👍 تفاعل جديد على تعليقك!",
            en: "👍 New reaction on your comment!"
        };

        const reactionWords = {
            like: { ar: "إعجاب", en: "like" },
            love: { ar: "حب", en: "love" },
            sad: { ar: "حزن", en: "sad" },
            angry: { ar: "غضب", en: "angry" }
        };

        const bodies = {
            ar: `${req.user.username || "شخص ما"} قام بـ ${reactionWords[type].ar} على تعليقك`,
            en: `${req.user.username || "Someone"} ${reactionWords[type].en}d your comment`
        };

        const title = titles[userLang];
        const body = bodies[userLang];

        // ✅ تخزين الإشعار أولاً (دايمًا، حتى لو التوكن باطل)
        try {
            await NotificationModell.create({
                userId: comment.user._id,
                postId: comment.postId || null, // لو عندك postId في الكومنت
                commentId: comment._id,
                title: {
                    ar: titles.ar,
                    en: titles.en
                },
                body: {
                    ar: bodies.ar,
                    en: bodies.en
                },
                type: "comment_reaction",
                deviceToken: comment.user.fcmToken || null,
                data: {
                    commentId: comment._id.toString(),
                    reactorUsername: req.user.username || "Someone"
                }
            });

            console.log(`✅ تم تخزين إشعار reaction على تعليق للمستخدم ${comment.user._id}`);
        } catch (storeError) {
            console.error("❌ فشل تخزين الإشعار في الداتابيز:", storeError.message);
        }

        // ✅ محاولة إرسال الإشعار (لو في توكن)
        if (comment.user.fcmToken) {
            try {
                await admin.messaging().send({
                    notification: { title, body },
                    data: {
                        commentId: comment._id.toString(),
                        type: "comment_reaction"
                    },
                    token: comment.user.fcmToken,
                });

                console.log(`✅ تم إرسال إشعار reaction على تعليق (${userLang})`);
            } catch (sendError) {
                console.error("❌ فشل إرسال إشعار reaction على تعليق:", sendError.message);

                if (sendError.message.includes("Requested entity was not found") ||
                    sendError.message.includes("The registration token is not a valid FCM registration token")) {

                    console.log(`🗑️ توكن FCM باطل، جاري حذفه من المستخدم ${comment.user._id}`);

                    comment.user.fcmToken = null;
                    await comment.user.save();
                }
            }
        } else {
            console.log(`⚠️ لا يوجد fcmToken للمستخدم ${comment.user._id}، الإشعار مخزن فقط`);
        }
    }

    res.json({
        message: `✅ تم إضافة ${type} بنجاح`,
        data: { type }
    });
});




export const signupServiceProvider = asyncHandelr(async (req, res, next) => {
    const {
        fullName,
        password,
        carNumber,
        accountType,
        email,
        phone,
        serviceType,
    } = req.body;

    // ✅ تحقق من وجود واحد من الاتنين فقط
    if (!email && !phone) {
        return next(new Error("يجب إدخال البريد الإلكتروني أو رقم الهاتف", { cause: 400 }));
    }

    // ✅ تحقق من وجود نوع الخدمة
    if (!serviceType || !['Driver', 'Doctor', 'Host', 'Delivery'].includes(serviceType)) {
        return next(new Error("نوع الخدمة غير صحيح أو مفقود", { cause: 400 }));
    }

    // ✅ تحقق من وجود مستخدم بنفس الإيميل أو الهاتف
    const checkuser = await dbservice.findOne({
        model: Usermodel,
        filter: {
            $or: [
                ...(email ? [{ email }] : []),
                ...(phone ? [{ phone }] : []),
            ],
        },
    });

    if (checkuser) {
        // ✅ لو المستخدم الحالي نوعه User → ممكن يسجل كمقدم خدمة
        if (checkuser.accountType === "User") {
            console.log("✅ المستخدم موجود كـ User، يمكنه التسجيل كمقدم خدمة.");

            // ✅ يسمح له فقط بالتسجيل كـ Driver أو Delivery
            if (["Driver", "Delivery"].includes(serviceType)) {
                console.log(`🚗 المستخدم User يسجل الآن كمقدم خدمة ${serviceType}، مسموح بالتسجيل.`);
            } else {
                return next(
                    new Error(`❌ لا يمكنك التسجيل كـ ${serviceType} باستخدام حساب User. فقط Driver أو Delivery مسموحين.`, { cause: 400 })
                );
            }
        }

        // ❌ لو المستخدم مقدم خدمة بالفعل بنفس النوع → مرفوض
        else if (checkuser.accountType === "ServiceProvider" && checkuser.serviceType === serviceType) {
            return next(new Error(`أنت مسجل بالفعل كمقدم خدمة بنفس النوع (${serviceType})`, { cause: 400 }));
        }

        // ❌ لو كان مقدم خدمة Driver لا يسجل كـ Delivery والعكس
        else if (
            checkuser.accountType === "ServiceProvider" &&
            (
                (checkuser.serviceType === "Driver" && serviceType === "Delivery") ||
                (checkuser.serviceType === "Delivery" && serviceType === "Driver")
            )
        ) {
            return next(new Error("❌ لا يمكنك التسجيل كـ Driver و Delivery في نفس الوقت.", { cause: 400 }));
        }

        // ❌ لو كان مقدم خدمة Host لا يسجل كـ Doctor والعكس
        else if (
            checkuser.accountType === "ServiceProvider" &&
            (
                (checkuser.serviceType === "Host" && serviceType === "Doctor") ||
                (checkuser.serviceType === "Doctor" && serviceType === "Host")
            )
        ) {
            return next(new Error("❌ لا يمكنك التسجيل كـ Host و Doctor في نفس الوقت.", { cause: 400 }));
        }

        // ✅ غير ذلك، مسموح له يسجل كخدمة مختلفة
        else {
            console.log("✅ المستخدم مقدم خدمة بنوع مختلف، يسمح بالتسجيل.");
        }
    }


    // ✅ تشفير كلمة المرور
    const hashpassword = await generatehash({ planText: password });

    // ✅ رفع الملفات (من req.files)
    const uploadedFiles = {};

    const uploadToCloud = async (file, folder) => {
        const isPDF = file.mimetype === "application/pdf";

        const uploaded = await cloud.uploader.upload(file.path, {
            folder,
            resource_type: isPDF ? "raw" : "auto", // ← أهم نقطة هنا
        });

        return {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id,
        };
    };

    // صورة البطاقة
    if (req.files?.nationalIdImage?.[0]) {
        uploadedFiles.nationalIdImage = await uploadToCloud(req.files.nationalIdImage[0], `users/nationalIds`);
    }

    // رخصة القيادة
    if (req.files?.driverLicenseImage?.[0]) {
        uploadedFiles.driverLicenseImage = await uploadToCloud(req.files.driverLicenseImage[0], `users/driverLicenses`);
    }

    // رخصة العربية
    if (req.files?.carLicenseImage?.[0]) {
        uploadedFiles.carLicenseImage = await uploadToCloud(req.files.carLicenseImage[0], `users/carLicenses`);
    }

    // صور العربية
    if (req.files?.carImages) {
        uploadedFiles.carImages = [];
        for (const file of req.files.carImages) {
            const uploaded = await uploadToCloud(file, `users/carImages`);
            uploadedFiles.carImages.push(uploaded);
        }
    }

    // مستندات إضافية (بدون Array)
    if (req.files?.Insurancedocuments?.[0]) {
        uploadedFiles.Insurancedocuments = await uploadToCloud(req.files.Insurancedocuments[0], `users/additionalDocs`);
    }

    // صورة البروفايل
    if (req.files?.profiePicture?.[0]) {
        uploadedFiles.profiePicture = await uploadToCloud(req.files.profiePicture[0], `users/profilePictures`);
    }

    // ✅ إنشاء المستخدم
    const user = await dbservice.create({
        model: Usermodel,
        data: {
            fullName,
            carNumber,
            password: hashpassword,
            email,
            phone,
            accountType,
            serviceType,
            location: {
                type: "Point",
                coordinates: [
                    req.body.longitude || 0,  // ← خط الطول
                    req.body.latitude || 0    // ← خط العرض
                ]
            },
            ...uploadedFiles,
        },
    });


    try {
        if (phone) {
            await sendOTP(phone);
            console.log(`📩 OTP تم إرساله إلى الهاتف: ${phone}`);
        } else if (email) {
            const otp = customAlphabet("0123456789", 4)();
            const html = vervicaionemailtemplet({ code: otp });

            const emailOTP = await generatehash({ planText: `${otp}` });
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await Usermodel.updateOne(
                { _id: user._id },
                {
                    emailOTP,
                    otpExpiresAt,
                    attemptCount: 0,
                }
            );

            await sendemail({
                to: email,
                subject: "Confirm Email",
                text: "رمز التحقق الخاص بك",
                html,
            });

            console.log(`📩 OTP تم إرساله إلى البريد: ${email}`);
        }
    } catch (error) {
        console.error("❌ فشل في إرسال OTP:", error.message);
        return next(new Error("فشل في إرسال رمز التحقق", { cause: 500 }));
    }

    return successresponse(res, "تم إنشاء حساب مقدم الخدمة بنجاح، وتم إرسال رمز التحقق", 201);
});



// export const updatePostStatus = asyncHandelr(async (req, res) => {
//     const { postId } = req.params;
//     const { status } = req.body; // "accepted" أو "rejected"

//     // التحقق من الحالة الصالحة
//     if (!["accepted", "rejected"].includes(status)) {
//         return res.status(400).json({
//             message: "❌ الحالة غير صالحة. يجب أن تكون 'accepted' أو 'rejected'"
//         });
//     }

//     // البحث عن البوست
//     const post = await Posttt.findById(postId)
//         .populate('user', 'username ImageId');

//     if (!post) {
//         return res.status(404).json({
//             message: "❌ البوست غير موجود"
//         });
//     }

//     // التحقق من صلاحية الأدمن (افترض إن عندك role في اليوزر)
//     // if (req.user.role !== "Admin" && req.user.role !== "Owner") {
//     //     return res.status(403).json({
//     //         message: "❌ غير مصرح لك بتغيير حالة البوست"
//     //     });
//     // }

//     // تحديث الحالة
//     post.status = status;
//     await post.save();

//     // رسالة نجاح مخصصة
//     const action = status === "accepted" ? "تم قبول" : "تم رفض";
//     res.status(200).json({
//         message: `✅ ${action} البوست بنجاح`,
//         post: {
//             _id: post._id,
//             text: post.text,
//             status: post.status,
//             user: post.user,
//             createdAt: post.createdAt
//         }
//     });
// });



export const updatePostStatus = asyncHandelr(async (req, res) => {
    const { postId } = req.params;
    const { status } = req.body; // "accepted" أو "rejected"

    // التحقق من الحالة الصالحة
    if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({
            message: "❌ الحالة غير صالحة. يجب أن تكون 'accepted' أو 'rejected'"
        });
    }

    // البحث عن البوست مع populate لليوزر
    const post = await Posttt.findById(postId)
        .populate({
            path: 'user',
            select: 'fcmToken lang username'
        });

    if (!post) {
        return res.status(404).json({
            message: "❌ البوست غير موجود"
        });
    }

    // التحقق من صلاحية الأدمن
    // if (req.user.role !== "Admin" && req.user.role !== "Owner") {
    //     return res.status(403).json({
    //         message: "❌ غير مصرح لك بتغيير حالة البوست"
    //     });
    // }

    // تحديث الحالة
    post.status = status;
    await post.save();

    // ✅ إرسال إشعار لصاحب البوست
    if (post.user) {
        const userLang = post.user.lang || "ar";

        const titles = {
            accepted: {
                ar: "🎉 تم قبول بوستك!",
                en: "🎉 Your post has been accepted!"
            },
            rejected: {
                ar: "❌ تم رفض بوستك",
                en: "❌ Your post has been rejected"
            }
        };

        const bodies = {
            accepted: {
                ar: "مبروك! بوستك تم نشره الآن وأصبح مرئيًا للجميع.",
                en: "Congratulations! Your post is now published and visible to everyone."
            },
            rejected: {
                ar: "تم رفض بوستك لعدم مطابقته لمعايير المنصة.",
                en: "Your post was rejected because it does not comply with platform guidelines."
            }
        };

        const title = titles[status][userLang];
        const body = bodies[status][userLang];

        // تخزين الإشعار أولاً
        try {
            await NotificationModell.create({
                userId: post.user._id,
                postId: post._id,
                title: {
                    ar: titles[status].ar,
                    en: titles[status].en
                },
                body: {
                    ar: bodies[status].ar,
                    en: bodies[status].en
                },
                type: "post_status",
                deviceToken: post.user.fcmToken || null,
                data: {
                    postId: post._id.toString(),
                    status: status
                }
            });

            console.log(`✅ تم تخزين إشعار ${status} للبوست للمستخدم ${post.user._id}`);
        } catch (storeError) {
            console.error("❌ فشل تخزين إشعار حالة البوست:", storeError.message);
        }

        // محاولة إرسال الإشعار
        if (post.user.fcmToken) {
            try {
                await admin.messaging().send({
                    notification: { title, body },
                    data: {
                        postId: post._id.toString(),
                        type: "post_status",
                        status: status
                    },
                    token: post.user.fcmToken,
                });

                console.log(`✅ تم إرسال إشعار ${status} للبوست (${userLang})`);
            } catch (sendError) {
                console.error("❌ فشل إرسال إشعار حالة البوست:", sendError.message);

                if (sendError.message.includes("Requested entity was not found") ||
                    sendError.message.includes("The registration token is not a valid FCM registration token")) {

                    console.log(`🗑️ توكن FCM باطل، جاري حذفه من المستخدم ${post.user._id}`);

                    post.user.fcmToken = null;
                    await post.user.save();
                }
            }
        } else {
            console.log(`⚠️ لا يوجد fcmToken، الإشعار مخزن فقط`);
        }
    }

    // رسالة النجاح للأدمن
    const action = status === "accepted" ? "تم قبول" : "تم رفض";

    res.status(200).json({
        message: `✅ ${action} البوست بنجاح`,
        post: {
            _id: post._id,
            text: post.text,
            status: post.status,
            user: {
                username: post.user.username
            },
            createdAt: post.createdAt
        }
    });
});


export const createPostReport = asyncHandelr(async (req, res) => {
    const { postId } = req.params;
    const { reportType, message } = req.body;
    const reportedBy = req.user._id;

   
    const post = await Posttt.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "❌ البوست غير موجود" });
    }

    // التحقق من الأنواع والرسالة
    const validTypes = ["spam", "inappropriate", "harassment", "violence", "hate_speech", "false_information", "copyright", "other"];
    if (!validTypes.includes(reportType)) {
        return res.status(400).json({ message: "❌ نوع البلاغ غير صالح" });
    }

    if (!message || message.trim().length < 10) {
        return res.status(400).json({ message: "❌ الرسالة مطلوبة ويجب أن تكون 10 أحرف على الأقل" });
    }

    // منع بلاغ مكرر من نفس المستخدم على نفس البوست
    const existingReport = await PostReport.findOne({ postId, reportedBy });
    if (existingReport) {
        return res.status(400).json({ message: "❌ لقد قمت بالإبلاغ عن هذا البوست من قبل" });
    }

    const report = await PostReport.create({
        postId,
        reportedBy,
        reportType,
        message: message.trim(),
    });

    await report.populate([
        { path: 'postId', select: 'text status' },
        { path: 'reportedBy', select: 'username ImageId' }
    ]);

    res.status(201).json({
        message: "✅ تم إرسال البلاغ بنجاح، سيتم مراجعته قريبًا",
        report
    });
});






// @desc    مراجعة بلاغ وتحديث حالته
// @route   PUT /api/reports/:reportId/review
// @access  Private (Admin)
export const reviewReport = asyncHandelr(async (req, res) => {
    const { reportId } = req.params;
    const { status, adminNote } = req.body; // status: "reviewed", "resolved", "dismissed"

    // التحقق من صلاحية الأدمن
    // if (req.user.role !== "Admin" && req.user.role !== "Owner") {
    //     return res.status(403).json({ message: "❌ غير مصرح لك بمراجعة البلاغات" });
    // }

    const validStatuses = ["reviewed", "resolved", "dismissed"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "❌ الحالة غير صالحة" });
    }

    const report = await PostReport.findById(reportId)
        .populate('postId', 'text')
        .populate('reportedBy', 'username');

    if (!report) {
        return res.status(404).json({ message: "❌ البلاغ غير موجود" });
    }

    report.status = status;
    report.adminNote = adminNote?.trim() || null;
    report.reviewedBy = req.user._id;
    report.updatedAt = new Date();

    await report.save();

    res.status(200).json({
        message: `✅ تم تحديث حالة البلاغ إلى "${status}" بنجاح`,
        report
    });
});




export const deletePost = asyncHandelr(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const post = await Posttt.findById(postId);

    if (!post) {
        return res.status(404).json({ message: "❌ البوست غير موجود" });
    }

    // التحقق من الصلاحيات
    // const isOwner = post.user.toString() === userId.toString();
    // const isAdmin = userRole === "Admin" || userRole === "Owner";

    // if (!isOwner && !isAdmin) {
    //     return res.status(403).json({
    //         message: "❌ غير مصرح لك بحذف هذا البوست"
    //     });
    // }

    // حذف الكومنتات المرتبطة بالبوست (اختياري، موصى بيه)
    await Commenttt.deleteMany({ postId });

    // حذف البوست نفسه
    await Posttt.findByIdAndDelete(postId);

    res.status(200).json({
        message: "✅ تم حذف البوست بنجاح",
        deletedPostId: postId
    });
});

export const getAllReports = asyncHandelr(async (req, res) => {
    // // التحقق من صلاحية الأدمن
    // if (req.user.role !== "Admin" && req.user.role !== "Owner") {
    //     return res.status(403).json({
    //         message: "❌ غير مصرح لك برؤية جميع البلاغات"
    //     });
    // }

    // جلب كل البلاغات مرتبة من الأحدث للأقدم
    const reports = await PostReport.find({})
        .sort({ createdAt: -1 })
        .populate([
            { path: 'postId', select: 'text status user' },
            { path: 'reportedBy', select: 'username ImageId' },
            { path: 'reviewedBy', select: 'username' }
        ]);

    // إحصائيات سريعة (اختياري، مفيدة للأدمن)
    const stats = {
        total: reports.length,
        pending: reports.filter(r => r.status === "pending").length,
        reviewed: reports.filter(r => r.status === "reviewed").length,
        resolved: reports.filter(r => r.status === "resolved").length,
        dismissed: reports.filter(r => r.status === "dismissed").length,
    };

    res.status(200).json({
        message: reports.length
            ? "✅ تم جلب جميع البلاغات بنجاح"
            : "📭 لا توجد بلاغات في النظام حاليًا",
        count: reports.length,
        stats,
        reports
    });
});


export const searchUserByEmail = asyncHandelr(async (req, res) => {
    const { email } = req.body;

    // التحقق من صلاحية الأدمن
    // if (req.user.role !== "Admin" && req.user.role !== "Owner") {
    //     return res.status(403).json({ message: "❌ غير مصرح لك بالبحث عن المستخدمين" });
    // }

    if (!email || typeof email !== "string" || !email.includes('@')) {
        return res.status(400).json({ message: "❌ يرجى إدخال إيميل صالح" });
    }

    const user = await Usermodel.findOne({ email: email.trim().toLowerCase() })
        .select('username email role phone ImageId createdAt isOnline');

    if (!user) {
        return res.status(404).json({ message: "📭 لا يوجد مستخدم بهذا الإيميل" });
    }

    res.status(200).json({
        message: "✅ تم العثور على المستخدم بنجاح",
        user
    });
});



export const updateUserRole = asyncHandelr(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    // التحقق من صلاحية الأدمن
    // if (req.user.role !== "Admin" && req.user.role !== "Owner") {
    //     return res.status(403).json({ message: "❌ غير مصرح لك بتغيير أدوار المستخدمين" });
    // }

    // قائمة الأدوار المسموحة (عدلها حسب احتياجك)
    const validRoles = ["User", "Admin", "Owner", "ServiceProvider", "manager", "staff"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({
            message: "❌ الدور غير صالح",
            validRoles
        });
    }

    const user = await Usermodel.findById(userId).select('username email role');

    if (!user) {
        return res.status(404).json({ message: "❌ المستخدم غير موجود" });
    }

    // اختياري: منع تغيير دور Owner إلا لـ Owner آخر
    // if (user.role === "Owner" && req.user.role !== "Owner") {
    //     return res.status(403).json({ message: "❌ لا يمكن تغيير دور المالك" });
    // }

    user.role = role;
    await user.save();

    res.status(200).json({
        message: `✅ تم تغيير دور المستخدم إلى "${role}" بنجاح`,
        user: {
            _id: user._id,
            username: user.username || null,
            email: user.email,
            role: user.role
        }
    });
});



export const deleteUser = asyncHandelr(async (req, res) => {
    const { userId } = req.params;

    // التحقق من صلاحية الأدمن أو المالك
    // if (req.user.role !== "Admin" && req.user.role !== "Owner") {
    //     return res.status(403).json({
    //         message: "❌ غير مصرح لك بحذف المستخدمين"
    //     });
    // }

    const userToDelete = await Usermodel.findById(userId);

    if (!userToDelete) {
        return res.status(404).json({ message: "❌ المستخدم غير موجود" });
    }

    // منع حذف Owner إلا بواسطة Owner آخر
    // if (userToDelete.role === "Owner" && req.user.role !== "Owner") {
    //     return res.status(403).json({
    //         message: "❌ لا يمكن حذف حساب المالك إلا بواسطة مالك آخر"
    //     });
    // }

    // منع حذف نفسك
    if (userToDelete._id.toString() === req.user._id.toString()) {
        return res.status(400).json({
            message: "❌ لا يمكنك حذف حسابك الخاص"
        });
    }

    // حذف المستخدم نهائيًا
    await Usermodel.findByIdAndDelete(userId);

    res.status(200).json({
        message: `✅ تم حذف المستخدم "${userToDelete.username}" بنجاح`,
        deletedUserId: userId
    });
});



export const getAllAdmins = asyncHandelr(async (req, res) => {


    const admins = await Usermodel.find({ role: "Admin" })
        .select('username email phone role createdAt isOnline ImageId')
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: admins.length
            ? "✅ تم جلب قائمة الأدمن بنجاح"
            : "📭 لا يوجد أدمن حاليًا غيرك",
        count: admins.length,
        admins
    });
});

export const updateUser = asyncHandelr(async (req, res, next) => {
    const { id } = req.params; // 👈 بنجيب ال id من الرابط
    const { fullName, password, email, phone, kiloPrice, isAgree, totalPoints } = req.body;

    // ✅ تحقق من وجود المستخدم
    const user = await dbservice.findOne({
        model: Usermodel,
        filter: { _id: id }
    });

    if (!user) {
        return next(new Error("المستخدم غير موجود", { cause: 404 }));
    }

    // ✅ تحقق من عدم تكرار الإيميل أو رقم الهاتف (لو المستخدم بيغيرهم)
    if (email || phone) {
        const checkuser = await dbservice.findOne({
            model: Usermodel,
            filter: {
                $and: [
                    { _id: { $ne: id } }, // 👈 استبعاد نفس المستخدم
                    {
                        $or: [
                            ...(email ? [{ email }] : []),
                            ...(phone ? [{ phone }] : [])
                        ]
                    }
                ]
            }
        });

        if (checkuser) {
            if (checkuser.email === email) {
                return next(new Error("البريد الإلكتروني مستخدم من قبل", { cause: 400 }));
            }
            if (checkuser.phone === phone) {
                return next(new Error("رقم الهاتف مستخدم من قبل", { cause: 400 }));
            }
        }
    }

    // ✅ لو فيه باسورد جديد يتعمله هاش
    let hashpassword;
    if (password) {
        hashpassword = await generatehash({ planText: password });
    }

    // ✅ تعديل البيانات
    const updatedUser = await dbservice.updateOne({
        model: Usermodel,
        filter: { _id: id },
        data: {
            ...(fullName && { fullName }),
            ...(kiloPrice && { kiloPrice }),
            ...(isAgree && { isAgree }),
            ...(totalPoints && { totalPoints }),
            ...(hashpassword && { password: hashpassword }),
            ...(email && { email }),
            ...(phone && { phone }),
        }
    });

    return successresponse(res, "✅ تم تعديل بيانات المستخدم بنجاح", 200, );
});

export const createOrUpdatePrivacyPolicy = asyncHandelr(async (req, res) => {
    const { content, version } = req.body;

    if (!content?.ar || !content?.en || !version) {
        return res.status(400).json({
            message: "❌ يجب إدخال النص بالعربي والإنجليزي والإصدار"
        });
    }

    // التحقق من صلاحية الأدمن
    // if (req.user.role !== "Admin" && req.user.role !== "Owner") {
    //     return res.status(403).json({ message: "❌ غير مصرح لك" });
    // }

    // إلغاء تفعيل الإصدار القديم لو موجود
    await PrivacyPolicy.updateMany({ isActive: true }, { isActive: false });

    // إنشاء إصدار جديد
    const policy = await PrivacyPolicy.create({
        content,
        version,
        isActive: true
    });

    res.status(201).json({
        message: "✅ تم حفظ سياسة الخصوصية بنجاح",
        policy
    });
});


export const getActivePrivacyPolicy = asyncHandelr(async (req, res) => {
    const policy = await PrivacyPolicy.findOne({ isActive: true })
        .select('content version createdAt');

    if (!policy) {
        return res.status(404).json({
            message: "📭 لا توجد سياسة خصوصية حاليًا"
        });
    }

    res.status(200).json({
        message: "✅ تم جلب سياسة الخصوصية بنجاح",
        policy
    });
});

// export const getDriverStats = asyncHandelr(async (req, res) => {
//     const { driverId } = req.params;

//     if (!driverId) {
//         return res.status(400).json({
//             success: false,
//             message: "❌ لازم تبعت driverId",
//         });
//     }

//     const finishedStatuses = ["ongoing finished", "DONE"];
//     const now = new Date();

//     // حساب بداية اليوم
//     const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     // حساب بداية الأسبوع (الاثنين)
//     const startOfWeek = new Date(now);
//     startOfWeek.setDate(now.getDate() - now.getDay() + 1);
//     startOfWeek.setHours(0, 0, 0, 0);
//     // حساب بداية الشهر
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//     // 🟢 جميع الرحلات المنتهية
//     const finishedRides = await rideSchema.find({
//         driverId,
//         status: { $in: finishedStatuses },
//     });

//     // 🟠 الرحلات الملغاة
//     const cancelledCount = await rideSchema.countDocuments({
//         driverId,
//         status: "CANCELLED",
//     });

//     // ✅ إجمالي الأرباح الكلي
//     const totalEarnings = finishedRides.reduce((sum, ride) => sum + (ride.price || 0), 0);

//     // ✅ الرحلات اليوم
//     const todayRides = finishedRides.filter(ride => new Date(ride.createdAt) >= startOfDay);
//     const todayCount = todayRides.length;
//     const todayEarnings = todayRides.reduce((sum, ride) => sum + (ride.price || 0), 0);

//     // ✅ الرحلات هذا الأسبوع
//     const weekRides = finishedRides.filter(ride => new Date(ride.createdAt) >= startOfWeek);
//     const weekCount = weekRides.length;
//     const weekEarnings = weekRides.reduce((sum, ride) => sum + (ride.price || 0), 0);

//     // ✅ الرحلات هذا الشهر
//     const monthRides = finishedRides.filter(ride => new Date(ride.createdAt) >= startOfMonth);
//     const monthCount = monthRides.length;
//     const monthEarnings = monthRides.reduce((sum, ride) => sum + (ride.price || 0), 0);

//     return res.status(200).json({
//         success: true,
//         message: "✅ تم جلب الإحصائيات بنجاح",
//         data: {
//             cancelledCount,
//             finishedCount: finishedRides.length,
//             totalEarnings,
//             stats: {
//                 today: { count: todayCount, earnings: todayEarnings },
//                 week: { count: weekCount, earnings: weekEarnings },
//                 month: { count: monthCount, earnings: monthEarnings },
//             }
//         }
//     });
// });



export const getDriverStats = asyncHandelr(async (req, res) => {
    const { driverId } = req.params;

    if (!driverId) {
        return res.status(400).json({
            success: false,
            message: "❌ لازم تبعت driverId",
        });
    }

    const finishedStatuses = ["ongoing finished", "DONE"];
    const now = new Date();

    // حساب بداية اليوم
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // حساب بداية الأسبوع (الاثنين)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    // حساب بداية الشهر
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 🟢 جميع الرحلات المنتهية
    const finishedRides = await rideSchema.find({
        driverId,
        status: { $in: finishedStatuses },
    });

    // 🟠 الرحلات الملغاة
    const cancelledCount = await rideSchema.countDocuments({
        driverId,
        status: "CANCELLED",
    });

    // ✅ إجمالي الأرباح الكلي
    const totalEarnings = finishedRides.reduce((sum, ride) => sum + (ride.price || 0), 0);

    // ✅ الرحلات اليوم
    const todayRides = finishedRides.filter(ride => new Date(ride.createdAt) >= startOfDay);
    const todayCount = todayRides.length;
    const todayEarnings = todayRides.reduce((sum, ride) => sum + (ride.price || 0), 0);

    // ✅ الرحلات هذا الأسبوع
    const weekRides = finishedRides.filter(ride => new Date(ride.createdAt) >= startOfWeek);
    const weekCount = weekRides.length;
    const weekEarnings = weekRides.reduce((sum, ride) => sum + (ride.price || 0), 0);

    // ✅ الرحلات هذا الشهر
    const monthRides = finishedRides.filter(ride => new Date(ride.createdAt) >= startOfMonth);
    const monthCount = monthRides.length;
    const monthEarnings = monthRides.reduce((sum, ride) => sum + (ride.price || 0), 0);

    // 🕒 تجهيز قائمة الرحلات مع التاريخ والوقت
    const rideHistory = finishedRides.map(ride => ({
        _id: ride._id,
        price: ride.price,
        status: ride.status,
        createdAt: ride.createdAt,
        updatedAt: ride.updatedAt
    }));

    return res.status(200).json({
        success: true,
        message: "✅ تم جلب الإحصائيات بنجاح",
        data: {
            cancelledCount,
            finishedCount: finishedRides.length,
            totalEarnings,
            stats: {
                today: { count: todayCount, earnings: todayEarnings },
                week: { count: weekCount, earnings: weekEarnings },
                month: { count: monthCount, earnings: monthEarnings },
            },
            rideHistory // 👈 إضافة التاريخ والوقت دون تغيير أي شيء آخر في الريسبونس
        }
    });
});







export const getDriverHistory = asyncHandelr(async (req, res) => {
    const { driverId } = req.params;

    if (!driverId) {
        return res.status(400).json({
            success: false,
            message: "❌ لازم تبعت driverId",
        });
    }

    const rides = await rideSchema.find({
        driverId,
        status: { $in: ["ongoing finished", "CANCELLED"] }
    })
        .populate("clientId", "fullName email phone") // لو عايز بيانات العميل
        .sort({ createdAt: -1 }); // أحدث الأول

    res.json({
        success: true,
        message: "✅ تم جلب الرحلات",
        count: rides.length,
        data: rides
    });
});
 


export const getClinetHistory = asyncHandelr(async (req, res) => {
    const { clientId } = req.params;

    if (!clientId) {
        return res.status(400).json({
            success: false,
            message: "❌ لازم تبعت clientId",
        });
    }

    const rides = await rideSchema.find({
        clientId,
        status: { $in: ["ongoing finished", "CANCELLED", "driver on the way", "PENDING", "DONE","ACCEPTED"] }
    })
        .populate("driverId", "fullName email phone") // لو عايز بيانات العميل
        .sort({ createdAt: -1 }); // أحدث الأول

    res.json({
        success: true,
        message: "✅ تم جلب الرحلات",
        count: rides.length,
        data: rides
    });
});




export const findNearbyDrivers = asyncHandelr(async (req, res, next) => {
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
        return next(new Error("مطلوب إرسال خط الطول والعرض", { cause: 400 }));
    } 

    const drivers = await Usermodel.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                distanceField: "distance", // ← اسم الفيلد الجديد
                spherical: true,
                maxDistance: 100000 // ← 5 كم
            }
        },
        {
            $match: { serviceType: "Driver" }
        },
        {
            $project: {
                fullName: 1,
                email: 1,
                "profiePicture.secure_url": 1,
                distance: { $divide: ["$distance", 1000] } // ← تحويل من متر إلى كم
            }
        }
    ]);

    res.status(200).json({
        message: "🚖 أقرب السائقين",
        count: drivers.length,
        data: drivers
    });
});



export const createRentalProperty = asyncHandelr (async (req, res, next) => {
    const {
        title,
        location,
        phoneNumber,
        description,
        price,
        category,
        amenities
    } = req.body;

    // تحقق من الحقول المطلوبة
    if (!title || !location || !phoneNumber || !description || !price || !category) {
        return next(new Error("جميع الحقول الأساسية مطلوبة", { cause: 400 }));
    }

    // رفع الملفات
    const uploadedFiles = {};

    const uploadToCloud = async (file, folder) => {
        const isPDF = file.mimetype === "application/pdf";
        const uploaded = await cloud.uploader.upload(file.path, {
            folder,
            resource_type: isPDF ? "raw" : "auto",
        });
        return {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id,
        };
    };

    // رفع صور العقار
    if (req.files?.images) {
        uploadedFiles.images = [];
        for (const file of req.files.images) {
            const uploaded = await uploadToCloud(file, `rentalProperties/images`);
            uploadedFiles.images.push(uploaded);
        }
    }

    // إنشاء العقار في قاعدة البيانات
    const property = await dbservice.create({
        model: RentalPropertyModel,
        data: {
            title,
            location,
            phoneNumber,
            description,
            price,
            category,
            amenities: amenities ? JSON.parse(amenities) : {},
            createdBy: req.user._id, // من التوكن
            ...uploadedFiles
        }
    });

    return res.status(201).json({
        message: "تم إنشاء العقار بنجاح",
        data: property
    });
});




export const getUserRentalProperties = asyncHandelr(async (req, res, next) => {
    const userId = req.user._id; // جاي من التوكن بعد الـ auth middleware
    const { category } = req.query; // الفلتر من الـ query

    // إعداد الفلتر
    const filter = { createdBy: userId };
    if (category) {
        filter.category = category; // يفلتر لو فيه category
    }

    // جلب العقارات
    const properties = await dbservice.findAll({
        model: RentalPropertyModel,
        filter,
    });

    return successresponse(res, "تم جلب العقارات بنجاح", 200, properties);
});


export const getAllRentalProperties = asyncHandelr(async (req, res, next) => {
    const { category } = req.query;

    let filter = {};
    if (category) {
        filter.category = category;
    }

    const properties = await RentalPropertyModel.find(filter)
        .populate("createdBy", "fullName") // 📌 إظهار الاسم فقط
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: "تم جلب العقارات بنجاح",
        count: properties.length,
        data: properties
    });
});


export const updateRentalProperty = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    // 🔍 جلب العقار
    const property = await dbservice.findOne({
        model: RentalPropertyModel,
        filter: { _id: id, createdBy: userId }
    });

    if (!property) {
        return next(new Error("العقار غير موجود أو ليس لديك صلاحية لتعديله", { cause: 404 }));
    }

    // 🟢 تجهيز البيانات التي سيتم تحديثها
    let updatedData = { ...req.body };

    // ✅ دالة آمنة لتحويل النص إلى JSON
    // ✅ دالة آمنة لتحويل النص إلى JSON
    const tryParse = (val, fallback) => {
        if (typeof val === "string") {
            try {
                return JSON.parse(val);
            } catch {
                return fallback;
            }
        }
        return val ?? fallback;
    };

    // ✅ تجهيز الـ amenities
    updatedData.amenities = tryParse(updatedData.amenities, undefined);
    if (updatedData.amenities === undefined) {
        delete updatedData.amenities;
    }


    // ✅ تجهيز الصور المرسلة (لو مفيش، نخليها null عشان نشتغل على القديمة)
    updatedData.images = tryParse(updatedData.images, null);

    const uploadToCloud = async (file, folder) => {
        const isPDF = file.mimetype === "application/pdf";
        const uploaded = await cloud.uploader.upload(file.path, {
            folder,
            resource_type: isPDF ? "raw" : "auto",
        });
        return {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id,
        };
    };

    // 🟢 إدارة الصور بدون إعادة رفع الكل
    if (req.body.removedImages || req.files?.images) {
        let finalImages = Array.isArray(property.images) ? [...property.images] : [];

        // 🛑 1- حذف الصور اللي اتبعت IDs بتاعها
        if (req.body.removedImages) {
            let removedImages = [];
            try {
                removedImages = JSON.parse(req.body.removedImages);
            } catch {
                removedImages = req.body.removedImages;
            }

            if (Array.isArray(removedImages)) {
                for (const imgId of removedImages) {
                    const img = finalImages.find(c => c.public_id === imgId);
                    if (img) {
                        // مسح من Cloudinary
                        await cloud.uploader.destroy(img.public_id);
                        // مسح من الـ Array
                        finalImages = finalImages.filter(c => c.public_id !== imgId);
                    }
                }
            }
        }

        // 🟢 2- إضافة الصور الجديدة
        if (req.files?.images) {
            const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            for (const file of files) {
                const uploaded = await uploadToCloud(file, `rentalProperties/images`);
                finalImages.push(uploaded);
            }
        }

        updatedData.images = finalImages;
    }

    // 🟢 تحديث البيانات في قاعدة البيانات
    const updatedProperty = await dbservice.findOneAndUpdate({
        model: RentalPropertyModel,
        filter: { _id: id, createdBy: userId },
        data: updatedData,
        options: { new: true }
    });

    // تحويل النتيجة لكائن JSON نظيف
    const cleanData = updatedProperty.toObject({ versionKey: false });

    return successresponse(res, "تم تحديث العقار بنجاح", 200, cleanData);
});






export const deleteRentalProperty = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    // 🔍 التأكد من وجود العقار وصلاحيته
    const property = await dbservice.findOne({
        model: RentalPropertyModel,
        filter: { _id: id, createdBy: userId }
    });

    if (!property) {
        return next(new Error("العقار غير موجود أو ليس لديك صلاحية لحذفه", { cause: 404 }));
    }

    // 🗑 حذف الصور من Cloudinary
    if (property.images && Array.isArray(property.images)) {
        for (const img of property.images) {
            if (img?.public_id) {
                await cloud.uploader.destroy(img.public_id);
            }
        }
    }

    // 🗑 حذف العقار من قاعدة البيانات
    await dbservice.deleteOne({
        model: RentalPropertyModel,
        filter: { _id: id, createdBy: userId }
    });

    return res.status(200).json({
        message: "تم حذف العقار بنجاح"
    });
});


export const getAllNormalUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        // جلب المستخدمين
        const users = await Usermodel.find({ accountType: "User" })
            .sort({ createdAt: -1 })
            .skip(Number(skip))
            .limit(Number(limit));

        // عدد المستخدمين الكلي
        const totalUsers = await Usermodel.countDocuments({ accountType: "User" });

        return res.status(200).json({
            message: "تم جلب المستخدمين بنجاح",
            total: totalUsers,
            page: Number(page),
            pages: Math.ceil(totalUsers / limit),
            data: users
        });
    } catch (error) {
        next(error);
    }
};




export const getAllServiceProviders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, serviceType } = req.query;
        const skip = (page - 1) * limit;

        // فلتر أساسي
        const filter = { accountType: "ServiceProvider" };

        // فلترة على حسب serviceType (اختياري)
        if (serviceType) {
            const cleanServiceType = String(serviceType).trim();
            filter.serviceType = { $regex: `^${cleanServiceType}$`, $options: 'i' };
        }

        // جلب البيانات
        const serviceProviders = await Usermodel.find(filter)
            .sort({ createdAt: -1 })
            .skip(Number(skip))
            .limit(Number(limit));

        // إجمالي العدد
        const total = await Usermodel.countDocuments(filter);

        return res.status(200).json({
            message: "تم جلب مزودي الخدمة بنجاح",
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: serviceProviders
        });
    } catch (error) {
        next(error);
    }
};


export const createDoctor = asyncHandelr(async (req, res, next) => {
    let {
        name,
        specialization,
        location,
        mapLink,
        titles,
        // medicalField,
        workingHours,
        rating,
        reviewCount,
        // latitude,
        // longitude,
        experience,
        consultationFee,
        hospitalName
    } = req.body;

    // 🧹 تنظيف القيم النصية
    const trimIfString = (val) => typeof val === 'string' ? val.trim() : val;

    name = trimIfString(name);
    specialization = trimIfString(specialization);
    location = trimIfString(location);
    mapLink = trimIfString(mapLink);
    // medicalField = trimIfString(medicalField);
    experience = trimIfString(experience);
    hospitalName = trimIfString(hospitalName);

    // تحقق من الحقول المطلوبة
    if (!name || !specialization || !location ||   !hospitalName) {
        return next(new Error("جميع الحقول الأساسية مطلوبة", { cause: 400 }));
    }

    // رفع الملفات
    const uploadedFiles = {};
    const uploadToCloud = async (file, folder) => {
        const isPDF = file.mimetype === "application/pdf";
        const uploaded = await cloud.uploader.upload(file.path, {
            folder,
            resource_type: isPDF ? "raw" : "auto",
        });
        return {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id,
        };
    };

    // رفع صورة البروفايل
    if (req.files?.profileImage?.[0]) {
        uploadedFiles.profileImage = await uploadToCloud(req.files.profileImage[0], `doctors/profile`);
    }

    // رفع الشهادات
    if (req.files?.certificates) {
        uploadedFiles.certificates = [];
        for (const file of req.files.certificates) {
            const uploaded = await uploadToCloud(file, `doctors/certificates`);
            uploadedFiles.certificates.push(uploaded);
        }
    }

    // إنشاء الدكتور في قاعدة البيانات
    const doctor = await DoctorModel.create({
        name,
        specialization,
        location,
        mapLink,
        titles: titles ? JSON.parse(titles) : [],
        // medicalField,
        certificates: uploadedFiles.certificates || [],
        workingHours: workingHours ? JSON.parse(workingHours) : {},
        rating: rating || 0,
        reviewCount: reviewCount || 0,
        profileImage: uploadedFiles.profileImage || null,
        // latitude,
        // longitude,
        experience,
        consultationFee,
        createdBy: req.user._id,
        hospitalName
    });

    return res.status(201).json({
        message: "تم إنشاء الدكتور بنجاح",
        data: doctor
    });
});
export const getDoctors = asyncHandelr(async (req, res, next) => {
    const { medicalField, specialization, location, page = 1, limit = 10 } = req.query;

    // تجهيز الفلترة
    const filter = {};
    if (medicalField) filter.medicalField = medicalField.trim();
    if (specialization) filter.specialization = { $regex: specialization.trim(), $options: "i" };
    if (location) filter.location = { $regex: location.trim(), $options: "i" };

    // الحساب
    const skip = (Number(page) - 1) * Number(limit);

    // جلب البيانات
    const doctors = await DoctorModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await DoctorModel.countDocuments(filter);

    return res.status(200).json({
        message: "تم جلب الأطباء بنجاح",
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        },
        data: doctors
    });
});


export const getOwnerRestaurants = asyncHandelr(async (req, res, next) => {
    // لازم يكون Owner
    const user = await Usermodel.findById(req.user._id);
    // if (!user || user.accountType !== "Owner") {
    //     return next(new Error("غير مسموح لك، يجب أن يكون حسابك Owner", { cause: 403 }));
    // }

    const restaurants = await RestaurantModell.find({ createdBy: req.user._id })
        .sort({ createdAt: -1 })
        .populate("authorizedUsers.user", "fullName email");

    res.status(200).json({
        message: "تم جلب المطاعم الخاصة بالمالك بنجاح",
        count: restaurants.length,
        data: restaurants
    });
});





export const getManagerRestaurants = asyncHandelr(async (req, res, next) => {
    const restaurant = await RestaurantModell.findOne({
        "authorizedUsers.user": req.user._id,
        "authorizedUsers.role": "manager"
    })
        .sort({ createdAt: -1 })
        .populate("createdBy", "fullName email")
        .populate("authorizedUsers.user", "fullName email");

    if (!restaurant) {
        return next(new Error("لا يوجد مطاعم أنت مدير فيها", { cause: 404 }));
    }

    res.status(200).json({
        message: "تم جلب المطاعم التي أنت مدير فيها بنجاح",
        count: 1,
        data: restaurant   // ⬅️ object مباشر مش array
    });
});





export const getAccessibleSupermarket = asyncHandelr(async (req, res, next) => {
    const { lang = "ar" } = req.query; // اللغة الافتراضية عربي

    const supermarket = await SupermarketModel.findOne({
        "authorizedUsers.user": req.user._id
    })
        .sort({ createdAt: -1 })
        .populate("createdBy", "fullName email")
        .populate("authorizedUsers.user", "fullName email");

    if (!supermarket) {
        return next(new Error("لا يوجد سوبر ماركت لديك صلاحية الوصول إليه", { cause: 404 }));
    }

    // ✅ تجهيز نسخة قابلة للتعديل
    const supermarketObj = supermarket.toObject();

    // ✅ استبدال الحقول متعددة اللغات بقيمة لغة واحدة
    const translateField = (field) => {
        if (field && typeof field === "object") {
            return field[lang] || field["ar"] || field["en"] || "";
        }
        return field;
    };

    supermarketObj.name = translateField(supermarketObj.name);
    supermarketObj.description = translateField(supermarketObj.description);

    res.status(200).json({
        message: "تم جلب السوبر ماركت الذي لديك صلاحية الوصول إليه بنجاح",
        lang,
        data: supermarketObj
    });
});


export const getSupermarketWithSectionsAndProducts = asyncHandelr(async (req, res, next) => {
    const { supermarketId } = req.params;
    const { lang = "ar" } = req.query;

    if (!supermarketId) {
        return next(new Error("رقم السوبر ماركت مطلوب", { cause: 400 }));
    }

    // ✅ تحقق إن السوبر ماركت موجود والمستخدم مالك أو Manager فيه
    const supermarket = await SupermarketModel.findOne({
        _id: supermarketId,
        $or: [
            { createdBy: req.user._id },
            { "authorizedUsers.user": req.user._id, "authorizedUsers.role": "staff" }
        ]
    });

    if (!supermarket) {
        return next(new Error("غير مصرح لك بعرض بيانات هذا السوبر ماركت", { cause: 403 }));
    }

    // ✅ دالة للترجمة حسب اللغة
    const translateField = (field) => {
        if (field && typeof field === "object") {
            return field[lang] || field["ar"] || field["en"] || "";
        }
        return field;
    };

    // 📦 هات الأقسام الخاصة بالسوبر ماركت
    const sections = await SectionModel.find({ supermarket: supermarketId })
        .populate("createdBy", "fullName email");

    // 🛒 هات المنتجات الخاصة بالسوبر ماركت
    const products = await ProductModelllll.find({ supermarket: supermarketId })
        .populate("createdBy", "fullName email");

    // 🔗 ربط الأقسام بالمنتجات
    const sectionsWithProducts = sections.map(section => {
        const sectionObj = section.toObject();
        sectionObj.name = translateField(sectionObj.name);
        sectionObj.description = translateField(sectionObj.description);

        sectionObj.products = products
            .filter(prod => prod.section.toString() === section._id.toString())
            .map(prod => {
                const prodObj = prod.toObject();
                prodObj.name = translateField(prodObj.name);
                prodObj.description = translateField(prodObj.description);
                return prodObj;
            });

        return sectionObj;
    });

    res.status(200).json({
        message: "تم جلب الأقسام والمنتجات بنجاح",
        supermarket: {
            _id: supermarket._id,
            name: translateField(supermarket.name),
            description: translateField(supermarket.description),
            phone: supermarket.phone,
            image: supermarket.image,
            bannerImages: supermarket.bannerImages
        },
        count: sectionsWithProducts.length,
        data: sectionsWithProducts
    });
});










export const addAuthorizedUser = asyncHandelr(async (req, res, next) => {
    const { restaurantId, userId, role } = req.body;

    // تحقق أن المستخدم الحالي هو الـ Owner
    const restaurant = await RestaurantModell.findOne({
        _id: restaurantId,
        createdBy: req.user._id
    });

    if (!restaurant) {
        return next(new Error("لا يمكنك تعديل هذا المطعم", { cause: 403 }));
    }

    // تحقق أن المستخدم موجود
    const targetUser = await Usermodel.findById(userId);
    if (!targetUser) {
        return next(new Error("المستخدم غير موجود", { cause: 404 }));
    }

    // تحقق إذا كان المستخدم مضاف مسبقاً
    const alreadyExists = restaurant.authorizedUsers.some(
        (auth) => auth.user.toString() === userId
    );
    if (alreadyExists) {
        return next(new Error("المستخدم مضاف بالفعل", { cause: 400 }));
    }

    // إضافة المستخدم المصرح له
    restaurant.authorizedUsers.push({
        user: userId,
        role: role || "manager"
    });
    await restaurant.save();

    // إرجاع المطعم مع بيانات المستخدمين المصرح لهم
    const updatedRestaurant = await RestaurantModell.findById(restaurant._id)
        .populate("authorizedUsers.user", "fullName email");

    res.status(200).json({
        message: "تم إضافة المستخدم المصرح له بنجاح",
        data: updatedRestaurant
    });
});

export const addAuthorizedUserToSupermarket = asyncHandelr(async (req, res, next) => {
    const { supermarketId, userId, role } = req.body;

    // ✅ تحقق أن المستخدم الحالي هو الـ Owner (صاحب السوبر ماركت)
    const supermarket = await SupermarketModel.findOne({
        _id: supermarketId,
        createdBy: req.user._id
    });

    if (!supermarket) {
        return next(new Error("لا يمكنك تعديل هذا السوبر ماركت", { cause: 403 }));
    }

    // ✅ تحقق أن المستخدم الهدف موجود
    const targetUser = await Usermodel.findById(userId);
    if (!targetUser) {
        return next(new Error("المستخدم غير موجود", { cause: 404 }));
    }

    // ✅ تحقق إذا كان المستخدم مضاف مسبقاً
    const alreadyExists = supermarket.authorizedUsers.some(
        (auth) => auth.user.toString() === userId
    );
    if (alreadyExists) {
        return next(new Error("المستخدم مضاف بالفعل", { cause: 400 }));
    }

    // ✅ إضافة المستخدم المصرح له
    supermarket.authorizedUsers.push({
        user: userId,
        role: role || "manager"
    });
    await supermarket.save();

    // ✅ إرجاع السوبر ماركت مع بيانات المستخدمين المصرح لهم
    const updatedSupermarket = await SupermarketModel.findById(supermarket._id)
        .populate("authorizedUsers.user", "fullName email");

    res.status(200).json({
        message: "تم إضافة المستخدم المصرح له بنجاح",
        data: updatedSupermarket
    });
});



export const getMyDoctorProfile = asyncHandelr(async (req, res, next) => {
    const doctor = await DoctorModel.findOne({ createdBy: req.user._id });

    return res.status(200).json({
        message: "تم جلب بيانات الطبيب بنجاح",
        data: doctor || null
    });
});

export const updateDoctor = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    // 🔍 جلب الدكتور
    const doctor = await DoctorModel.findOne({ _id: id, createdBy: userId });
    if (!doctor) {
        return next(new Error("لم يتم العثور على بيانات الطبيب أو ليس لديك صلاحية لتعديلها", { cause: 404 }));
    }

    // 🟢 دالة تشيل المسافات من النصوص
    const trimIfString = (val) => typeof val === 'string' ? val.trim() : val;

    // 🟢 تجهيز البيانات
    let updatedData = {};
    for (const [key, value] of Object.entries(req.body)) {
        updatedData[key] = trimIfString(value);
    }

    // ✅ دالة لتحويل النص لـ JSON لو لزم
    const tryParse = (val, fallback) => {
        if (typeof val === "string") {
            try { return JSON.parse(val); } catch { return fallback; }
        }
        return val ?? fallback;
    };

    updatedData.titles = tryParse(updatedData.titles, doctor.titles);
    updatedData.workingHours = tryParse(updatedData.workingHours, doctor.workingHours);

    const uploadToCloud = async (file, folder) => {
        const isPDF = file.mimetype === "application/pdf";
        const uploaded = await cloud.uploader.upload(file.path, {
            folder,
            resource_type: isPDF ? "raw" : "auto",
        });
        return { secure_url: uploaded.secure_url, public_id: uploaded.public_id };
    };

    // 🟢 تحديث صورة البروفايل
    if (req.files?.profileImage?.[0]) {
        if (doctor.profileImage?.public_id) {
            await cloud.uploader.destroy(doctor.profileImage.public_id);
        }
        updatedData.profileImage = await uploadToCloud(req.files.profileImage[0], `doctors/profile`);
    }

    // 🟢 إدارة الشهادات بدون إعادة رفع الكل
    if (req.body.removedCertificates || req.files?.certificates) {
        let finalCertificates = Array.isArray(doctor.certificates) ? [...doctor.certificates] : [];

        // 🛑 1- حذف الشهادات اللي اتبعت IDs بتاعها
        if (req.body.removedCertificates) {
            let removedCertificates = [];
            try {
                removedCertificates = JSON.parse(req.body.removedCertificates);
            } catch {
                removedCertificates = req.body.removedCertificates;
            }

            if (Array.isArray(removedCertificates)) {
                for (const certId of removedCertificates) {
                    const cert = finalCertificates.find(c => c.public_id === certId);
                    if (cert) {
                        // مسح من Cloudinary
                        await cloud.uploader.destroy(cert.public_id);
                        // مسح من الـ Array
                        finalCertificates = finalCertificates.filter(c => c.public_id !== certId);
                    }
                }
            }
        }

        // 🟢 2- إضافة الشهادات الجديدة
        if (req.files?.certificates) {
            for (const file of req.files.certificates) {
                const uploaded = await uploadToCloud(file, `doctors/certificates`);
                finalCertificates.push(uploaded);
            }
        }

        updatedData.certificates = finalCertificates;
    }

    // 🟢 تحديث البيانات في قاعدة البيانات
    const updatedDoctor = await DoctorModel.findOneAndUpdate(
        { _id: id, createdBy: userId },
        updatedData,
        { new: true }
    );

    return res.status(200).json({
        message: "تم تحديث بيانات الطبيب بنجاح",
        data: updatedDoctor
    });
});



export const deleteDoctor = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    // 🔍 جلب الدكتور
    const doctor = await DoctorModel.findOne({ _id: id, createdBy: userId });
    if (!doctor) {
        return next(new Error("لم يتم العثور على بيانات الطبيب أو ليس لديك صلاحية للحذف", { cause: 404 }));
    }

    // 🗑️ حذف صورة البروفايل من Cloudinary
    if (doctor.profileImage?.public_id) {
        await cloud.uploader.destroy(doctor.profileImage.public_id);
    }

    // 🗑️ حذف الشهادات من Cloudinary
    if (Array.isArray(doctor.certificates)) {
        for (const cert of doctor.certificates) {
            if (cert?.public_id) {
                await cloud.uploader.destroy(cert.public_id);
            }
        }
    }

    // 🗑️ حذف من قاعدة البيانات
    await DoctorModel.deleteOne({ _id: id, createdBy: userId });

    return res.status(200).json({
        message: "تم حذف بيانات الطبيب والصور بنجاح"
    });
});


export const createRestaurant = asyncHandelr(async (req, res, next) => {
    let { name, discripion, phone, websiteLink ,rating  , isOpen } = req.body;

    // 🧹 تنظيف القيم النصية
    const trimIfString = (val) => typeof val === "string" ? val.trim() : val;
    name = trimIfString(name);
    // cuisine = trimIfString(cuisine);
    // deliveryTime = trimIfString(deliveryTime);
    // distance = trimIfString(distance);
    phone = trimIfString(phone);
    discripion = trimIfString(discripion);
    websiteLink = trimIfString(websiteLink);
    // ✅ تحقق من صلاحية المستخدم
    // const user = await Usermodel.findById(req.user._id);
    // if (!user || user.accountType !== "Owner") {
    //     return next(new Error("غير مسموح لك بإنشاء مطعم، يجب أن يكون حسابك Owner", { cause: 403 }));
    // }

    // ✅ تحقق من الحقول المطلوبة
    // if (!name || !cuisine || !deliveryTime || !distance) {
    //     return next(new Error("جميع الحقول الأساسية مطلوبة", { cause: 400 }));
    // }

    // رفع صورة المطعم
    let uploadedImage = null;
    if (req.files?.image?.[0]) {
        const file = req.files.image[0];
        const uploaded = await cloud.uploader.upload(file.path, { folder: "restaurants/images" });
        uploadedImage = {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id
        };
    }
    let uploadedMenuImages = [];
    if (req.files?.menuImages) {
        for (const file of req.files.menuImages) {
            const uploaded = await cloud.uploader.upload(file.path, { folder: "restaurants/menu" });
            uploadedMenuImages.push({
                secure_url: uploaded.secure_url,
                public_id: uploaded.public_id
            });
        }
    }
    // إنشاء المطعم
    const restaurant = await RestaurantModell.create({
        name,
        // cuisine,
        phone,
        discripion,
        websiteLink,
        rating: rating || 0,
        // deliveryTime,
        // distance,
        image: uploadedImage,
        menuImages: uploadedMenuImages, 
        isOpen: isOpen ?? true,
        createdBy: req.user._id
    });

    return res.status(201).json({
        message: "تم إنشاء المطعم بنجاح",
        data: restaurant
    });
});








export const updateRestaurant = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    // 🔍 التحقق من وجود المطعم وصلاحية المستخدم
    const restaurant = await RestaurantModell.findOne({
        _id: id,
        createdBy: userId
    });

    if (!restaurant) {
        return next(new Error("المطعم غير موجود أو ليس لديك صلاحية لتعديله", { cause: 404 }));
    }

    // 🟢 تجهيز البيانات المحدثة
    let updatedData = { ...req.body };

    // ✅ دالة آمنة لتحويل النص إلى JSON عند الحاجة
    const tryParse = (val, fallback) => {
        if (typeof val === "string") {
            try {
                return JSON.parse(val);
            } catch {
                return fallback;
            }
        }
        return val ?? fallback;
    };

    // ✅ تنظيف النصوص
    const trimIfString = (val) => typeof val === "string" ? val.trim() : val;
    ["name", "discripion", "phone", "websiteLink"].forEach(field => {
        if (updatedData[field]) updatedData[field] = trimIfString(updatedData[field]);
    });

    // ✅ دالة رفع الصور إلى Cloudinary
    const uploadToCloud = async (file, folder) => {
        const isPDF = file.mimetype === "application/pdf";
        const uploaded = await cloud.uploader.upload(file.path, {
            folder,
            resource_type: isPDF ? "raw" : "auto",
        });
        return {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id,
        };
    };

    // 🟣 تحديث الصورة الرئيسية للمطعم (image)
    if (req.files?.image?.[0]) {
        // حذف الصورة القديمة إن وجدت
        if (restaurant.image?.public_id) {
            await cloud.uploader.destroy(restaurant.image.public_id);
        }

        const uploaded = await uploadToCloud(req.files.image[0], "restaurants/images");
        updatedData.image = uploaded;
    }

    // 🟢 إدارة صور القائمة (menuImages)
    if (req.body.removedMenuImages || req.files?.menuImages) {
        let finalMenuImages = Array.isArray(restaurant.menuImages)
            ? [...restaurant.menuImages]
            : [];

        // 🛑 1- حذف الصور المطلوبة
        if (req.body.removedMenuImages) {
            let removedMenuImages = [];
            try {
                removedMenuImages = JSON.parse(req.body.removedMenuImages);
            } catch {
                removedMenuImages = req.body.removedMenuImages;
            }

            if (Array.isArray(removedMenuImages)) {
                for (const imgId of removedMenuImages) {
                    const img = finalMenuImages.find(c => c.public_id === imgId);
                    if (img) {
                        await cloud.uploader.destroy(img.public_id);
                        finalMenuImages = finalMenuImages.filter(c => c.public_id !== imgId);
                    }
                }
            }
        }

        // 🟢 2- إضافة الصور الجديدة للقائمة
        if (req.files?.menuImages) {
            const files = Array.isArray(req.files.menuImages)
                ? req.files.menuImages
                : [req.files.menuImages];
            for (const file of files) {
                const uploaded = await uploadToCloud(file, "restaurants/menu");
                finalMenuImages.push(uploaded);
            }
        }

        updatedData.menuImages = finalMenuImages;
    }

    // 🟢 تحديث البيانات في قاعدة البيانات
    const updatedRestaurant = await RestaurantModell.findOneAndUpdate(
        { _id: id, createdBy: userId },
        updatedData,
        { new: true }
    );

    return res.status(200).json({
        message: "تم تحديث بيانات المطعم بنجاح",
        data: updatedRestaurant
    });
});



export const updateProduct = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    // 🔍 التحقق من وجود المنتج وصلاحية المستخدم
    const product = await ProductModell.findOne({ _id: id, createdBy: userId });
    if (!product) {
        return next(new Error("المنتج غير موجود أو ليس لديك صلاحية لتعديله", { cause: 404 }));
    }

    // 🟢 تجهيز البيانات المحدثة
    let updatedData = { ...req.body };

    // ✅ دالة تنظيف النصوص
    const trimIfString = (val) => typeof val === "string" ? val.trim() : val;
    ["name", "description"].forEach(field => {
        if (updatedData[field]) updatedData[field] = trimIfString(updatedData[field]);
    });

    // ✅ دالة آمنة لتحويل النص إلى JSON عند الحاجة
    const tryParse = (val, fallback) => {
        if (typeof val === "string") {
            try {
                return JSON.parse(val);
            } catch {
                return fallback;
            }
        }
        return val ?? fallback;
    };

    // ✅ دالة رفع الصور إلى Cloudinary
    const uploadToCloud = async (file, folder) => {
        const uploaded = await cloud.uploader.upload(file.path, {
            folder,
            resource_type: "auto",
        });
        return {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id,
        };
    };

    // 🟢 إدارة الصور (images)
    if (req.body.removedImages || req.files?.images) {
        let finalImages = Array.isArray(product.images)
            ? [...product.images]
            : [];

        // 🛑 1- حذف الصور القديمة المطلوبة
        if (req.body.removedImages) {
            let removedImages = [];
            try {
                removedImages = JSON.parse(req.body.removedImages);
            } catch {
                removedImages = req.body.removedImages;
            }

            if (Array.isArray(removedImages)) {
                for (const imgId of removedImages) {
                    const img = finalImages.find(c => c.public_id === imgId);
                    if (img) {
                        await cloud.uploader.destroy(img.public_id);
                        finalImages = finalImages.filter(c => c.public_id !== imgId);
                    }
                }
            }
        }

        // 🟢 2- إضافة الصور الجديدة
        if (req.files?.images) {
            const files = Array.isArray(req.files.images)
                ? req.files.images
                : [req.files.images];

            for (const file of files) {
                const uploaded = await uploadToCloud(file, "restaurants/products");
                finalImages.push(uploaded);
            }
        }

        updatedData.images = finalImages;
    }

    // 🟢 تحديث البيانات في قاعدة البيانات
    const updatedProduct = await ProductModell.findOneAndUpdate(
        { _id: id, createdBy: userId },
        updatedData,
        { new: true }
    );

    return res.status(200).json({
        message: "تم تحديث بيانات المنتج بنجاح ✅",
        data: updatedProduct
    });
});











export const deleteRestaurant = asyncHandelr(async (req, res, next) => {
    const { id } = req.params; // 📌 معرف المطعم من الـ URL

    // ✅ التحقق من وجود المطعم
    const restaurant = await RestaurantModell.findById(id);
    if (!restaurant) {
        return next(new Error("❌ المطعم غير موجود", { cause: 404 }));
    }

    // ✅ التحقق من صلاحية المستخدم
    // const user = await Usermodel.findById(req.user._id);
    // if (!user || user.accountType !== "Owner") {
    //     return next(new Error("🚫 غير مصرح لك بحذف المطاعم", { cause: 403 }));
    // }

    // ✅ التحقق أن صاحب المطعم هو نفسه المستخدم الحالي
    if (restaurant.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("🚫 لا يمكنك حذف مطعم لم تقم بإنشائه", { cause: 403 }));
    }

    // 🧹 حذف الصور من Cloudinary
    try {
        if (restaurant.image?.public_id) {
            await cloud.uploader.destroy(restaurant.image.public_id);
        }

        if (restaurant.menuImages?.length > 0) {
            for (const menuImage of restaurant.menuImages) {
                if (menuImage.public_id) {
                    await cloud.uploader.destroy(menuImage.public_id);
                }
            }
        }
    } catch (err) {
        console.error("⚠️ فشل في حذف الصور من Cloudinary:", err.message);
    }

    // ✅ حذف المطعم من قاعدة البيانات
    await RestaurantModell.findByIdAndDelete(id);

    return res.status(200).json({
        message: "✅ تم حذف المطعم بنجاح",
        deletedId: id
    });
});
















export const getRestaurants = asyncHandelr(async (req, res, next) => {
    const { cuisine, name, isOpen, page = 1, limit = 10 } = req.query;

    // تجهيز الفلترة
    const filter = {};
    if (cuisine) filter.cuisine = { $regex: cuisine.trim(), $options: "i" };
    if (name) filter.name = { $regex: name.trim(), $options: "i" };
    if (isOpen !== undefined) filter.isOpen = isOpen === "true";

    // الحساب
    const skip = (Number(page) - 1) * Number(limit);

    // جلب البيانات مع بيانات الـ Owner
    const restaurants = await RestaurantModell.find(filter)
        .populate({
            path: "createdBy",
            select: "fullName email"
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await RestaurantModell.countDocuments(filter);

    return res.status(200).json({
        message: "تم جلب المطاعم بنجاح",
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        },
        data: restaurants
    });
});


export const getProductsByRestaurant =asyncHandelr(async (req, res, next) => {
    const { restaurantId } = req.params;
    const { name, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    // الفلترة
    const filter = { restaurant: restaurantId };
    if (name) filter.name = { $regex: name.trim(), $options: "i" };
    if (minPrice !== undefined) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice !== undefined) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    // الحساب
    const skip = (Number(page) - 1) * Number(limit);

    // جلب البيانات
    const products = await ProductModell.find(filter)
        .populate({
            path: "createdBy",
            select: "fullName email" // بيانات صاحب المنتج
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await ProductModell.countDocuments(filter);

    return res.status(200).json({
        message: "تم جلب المنتجات بنجاح",
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        },
        data: products
    });
});


export const createProduct = asyncHandelr(async (req, res, next) => {
    let { restaurantId, name, description, price, discount } = req.body;

    name = name?.trim();
    description = description?.trim();

    // ✅ تحقق من الحقول المطلوبة
    if (!restaurantId || !name || !price) {
        return next(new Error("جميع الحقول الأساسية مطلوبة", { cause: 400 }));
    }

    // رفع صور المنتج
    let uploadedImages = [];
    if (req.files?.images) {
        for (const file of req.files.images) {
            const uploaded = await cloud.uploader.upload(file.path, { folder: "restaurants/products" });
            uploadedImages.push({
                secure_url: uploaded.secure_url,
                public_id: uploaded.public_id
            });
        }
    }

    // إنشاء المنتج
    const product = await ProductModell.create({
        restaurant: restaurantId,
        name,
        description,
        images: uploadedImages,
        price,
        discount: discount || 0,
        createdBy: req.user._id
    });

    return res.status(201).json({
        message: "تم إنشاء المنتج بنجاح",
        data: product
    });
});



















export const deleteProduct = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    // 🔍 البحث عن المنتج والتأكد من أن المستخدم هو المنشئ
    const product = await ProductModell.findOne({ _id: id, createdBy: userId });

    if (!product) {
        return next(new Error("المنتج غير موجود أو ليس لديك صلاحية لحذفه", { cause: 404 }));
    }

    // 🧹 حذف الصور من Cloudinary
    if (Array.isArray(product.images) && product.images.length > 0) {
        for (const img of product.images) {
            if (img.public_id) {
                await cloud.uploader.destroy(img.public_id);
            }
        }
    }

    // 🗑️ حذف المنتج من قاعدة البيانات
    await ProductModell.deleteOne({ _id: id, createdBy: userId });

    return res.status(200).json({
        message: "تم حذف المنتج بنجاح ✅"
    });
});









// export const createOrder = asyncHandelr(async (req, res, next) => {
//     let { restaurantId, contactNumber, websiteLink, additionalNotes, products } = req.body;

//     // ✅ تحقق من الحقول
//     if (!restaurantId || !contactNumber || !products?.length) {
//         return next(new Error("جميع الحقول الأساسية مطلوبة (المطعم، رقم التواصل، المنتجات)", { cause: 400 }));
//     }

//     // ✅ تأكد أن المطعم موجود (مع الـ authorizedUsers)
//     const restaurant = await RestaurantModell.findById(restaurantId)
//         .populate("createdBy", "name fcmToken") // صاحب المطعم
//         .populate("authorizedUsers.user", "name fcmToken"); // المدراء/الستاف

//     if (!restaurant) {
//         return next(new Error("المطعم غير موجود", { cause: 404 }));
//     }

//     // 🛠 إنشاء الأوردر
//     const order = await OrderModel.create({
//         restaurant: restaurant._id,
//         contactNumber: contactNumber || restaurant.phone,
//         websiteLink: websiteLink || restaurant.websiteLink,
//         additionalNotes,
//         products,
//         createdBy: req.user._id
//     });

//     // 📌 جهز لستة المستقبلين (الاونر + المدراء)
//     const recipients = [];

//     // صاحب المطعم
//     if (restaurant.createdBy?.fcmToken) {
//         recipients.push({
//             user: restaurant.createdBy._id,
//             fcmToken: restaurant.createdBy.fcmToken,
//         });
//     }

//     // المدراء
//     restaurant.authorizedUsers.forEach(authUser => {
//         if (authUser.role === "manager" && authUser.user?.fcmToken) {
//             recipients.push({
//                 user: authUser.user._id,
//                 fcmToken: authUser.user.fcmToken,
//             });
//         }
//     });

//     // 🛑 لو مفيش حد عنده deviceToken
//     if (!recipients.length) {
//         console.log("⚠️ مفيش حد ليه توكن يوصله إشعار");
//     } else {
//         const title = "🚀 طلب جديد";
//         const body = `تم استلام طلب جديد برقم ${order._id}`;

//         // بعت إشعار لكل واحد
//         for (const recipient of recipients) {
//             try {
//                 await admin.messaging().send({
//                     notification: {
//                         title: "🚀 طلب جديد",
//                         body: "تم استلام طلب جديد"
//                     },
//                     data: {
//                         orderId: order._id.toString(),
//                         restaurantId: restaurant._id.toString(),
//                         createdAt: order.createdAt.toISOString()
//                     },
//                     token: recipient.fcmToken,
//                 });

//                 console.log(`✅ تم إرسال إشعار لليوزر ${recipient.user}`);

//                 await NotificationModell.create({
//                     restaurant: restaurant._id,
//                     order: order._id,
//                     title: "🚀 طلب جديد",
//                     body: "تم استلام طلب جديد",
//                     fcmToken: recipient.fcmToken,
//                 });
//             } catch (error) {
//                 console.error("❌ فشل إرسال الإشعار:", error);
//             }
//         }

//     }

//     res.status(201).json({
//         message: "تم إنشاء الأوردر بنجاح",
//         data: order
//     });
// });


export const createAppointment = asyncHandelr(async (req, res, next) => {
    const { doctorId, date, time, additionalNotes } = req.body;

    // ✅ تحقق من الحقول
    if (!doctorId || !date || !time) {
        return next(new Error("جميع الحقول الأساسية مطلوبة (الدكتور، اليوم، الوقت)", { cause: 400 }));
    }

    // ✅ تأكد أن الدكتور موجود ومعاه fcmToken
    const doctor = await DoctorModel.findById(doctorId)
        .populate("createdBy", "fullName fcmToken"); // صاحب البروفايل (الدكتور نفسه)

    if (!doctor) {
        return next(new Error("الدكتور غير موجود", { cause: 404 }));
    }

    // 🛠 إنشاء الحجز
    const appointment = await AppointmentModel.create({
        doctor: doctor._id,
        patient: req.user._id,
        date,
        time,
        additionalNotes,
    });

    // 📌 تجهيز المستقبل (الدكتور)
    const recipients = [];

    if (doctor.createdBy?.fcmToken) {
        recipients.push({
            user: doctor.createdBy._id,
            fcmToken: doctor.createdBy.fcmToken,
        });
    }

    // 🛑 لو مفيش fcmToken
    if (!recipients.length) {
        console.log("⚠️ مفيش حد ليه توكن يوصله إشعار");
    } else {
        const title = "📅 حجز جديد";
        const body = `تم استلام حجز جديد مع الدكتور ${doctor.name} في ${date} - ${time}`;

        for (const recipient of recipients) {
            try {
                await admin.messaging().send({
                    notification: { title, body },
                    data: {
                        appointmentId: appointment._id.toString(),
                        doctorId: doctor._id.toString(),
                        createdAt: appointment.createdAt.toISOString()
                    },
                    token: recipient.fcmToken,
                });

                console.log(`✅ تم إرسال إشعار للدكتور ${recipient.user}`);

                await NotificationModell.create({
                    restaurant: doctor._id,
                    order: null,
                    title,
                    body,
                    fcmToken: recipient.fcmToken,
                });
            } catch (error) {
                if (error.code === "messaging/registration-token-not-registered") {
                    console.warn(`⚠️ توكن غير صالح: ${recipient.fcmToken} - هيتم مسحه`);
                    await Usermodel.updateOne(
                        { _id: recipient.user },
                        { $set: { fcmToken: null } }
                    );
                } else {
                    console.error("❌ فشل إرسال الإشعار:", error);
                }
            }
        }
    }

    res.status(201).json({
        message: "تم إنشاء الحجز بنجاح",
        data: appointment
    });
});

export const getDoctorAppointments = asyncHandelr(async (req, res, next) => {
    // 👨‍⚕️ doctorId جاي من الـ params
    const { doctorId } = req.params;

    // ✅ تأكد أن الدكتور موجود
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) {
        return next(new Error("الدكتور غير موجود", { cause: 404 }));
    }

    // 🛠 هجيب كل الحجوزات الخاصة بالدكتور ده
    const appointments = await AppointmentModel.find({ doctor: doctorId })
        .populate("doctor", "name specialty")
        .populate("patient", "fullName email phone")
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: "تم جلب الحجوزات الخاصة بالدكتور بنجاح",
        count: appointments.length,
        data: appointments
    });
});




export const createPropertyBooking = asyncHandelr(async (req, res, next) => {
    const { propertyId, startDate, endDate, periodType, additionalNotes } = req.body;

    // ✅ تحقق من الحقول
    if (!propertyId || !startDate || !endDate || !periodType) {
        return next(new Error("جميع الحقول الأساسية مطلوبة (العقار، المدة، التواريخ)", { cause: 400 }));
    }

    // ✅ تأكد أن العقار موجود ومعاه صاحب
    const property = await RentalPropertyModel.findById(propertyId)
        .populate("createdBy", "fullName fcmToken");

    if (!property) {
        return next(new Error("العقار غير موجود", { cause: 404 }));
    }

    // 🛠 إنشاء الحجز
    const booking = await PropertyBookingModel.create({
        property: property._id,
        user: req.user._id,
        startDate,
        endDate,
        periodType,
        additionalNotes,
    });

    // 📌 تجهيز المستقبل (صاحب العقار)
    const recipients = [];

    if (property.createdBy?.fcmToken) {
        recipients.push({
            user: property.createdBy._id,
            fcmToken: property.createdBy.fcmToken,
        });
    }

    // 🛑 لو مفيش fcmToken
    if (!recipients.length) {
        console.log("⚠️ مفيش صاحب عقار ليه توكن يوصله إشعار");
    } else {
        const title = "🏠 حجز جديد";
        const body = `تم استلام حجز جديد لعقار (${property.title}) من ${startDate} إلى ${endDate}`;

        for (const recipient of recipients) {
            try {
                await admin.messaging().send({
                    notification: { title, body },
                    data: {
                        bookingId: booking._id.toString(),
                        propertyId: property._id.toString(),
                        createdAt: booking.createdAt.toISOString()
                    },
                    token: recipient.fcmToken,
                });

                console.log(`✅ تم إرسال إشعار لصاحب العقار ${recipient.user}`);

                await NotificationModell.create({
                    user: property.createdBy._id, // ⬅️ صاحب العقار
                    title,
                    body,
                    deviceToken: recipient.fcmToken,
                    order: property._id  
                });
            } catch (error) {
                if (error.code === "messaging/registration-token-not-registered") {
                    console.warn(`⚠️ توكن غير صالح: ${recipient.fcmToken} - هيتم مسحه`);
                    await Usermodel.updateOne(
                        { _id: recipient.user },
                        { $set: { fcmToken: null } }
                    );
                } else {
                    console.error("❌ فشل إرسال الإشعار:", error);
                }
            }
        }
    }

    res.status(201).json({
        message: "✅ تم إنشاء الحجز بنجاح",
        data: booking
    });
});

export const getPropertyBookings = asyncHandelr(async (req, res, next) => {
    // 🏡 propertyId جاي من الـ params
    const { propertyId } = req.params;

    // ✅ تأكد أن العقار موجود
    const property = await RentalPropertyModel.findById(propertyId);
    if (!property) {
        return next(new Error("العقار غير موجود", { cause: 404 }));
    }

    // 🛠 هجيب كل الحجوزات الخاصة بالعقار ده
    const bookings = await PropertyBookingModel.find({ property: propertyId })
        .populate("property", "title location price")   // بيانات العقار
        .populate("user", "fullName email phone")       // بيانات العميل
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: "✅ تم جلب الحجوزات الخاصة بالعقار بنجاح",
        count: bookings.length,
        data: bookings
    });
});
export const getNotificationsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // جلب الإشعارات الخاصة بالمطعم
        const notifications = await NotificationModell.find({ restaurant: restaurantId })
            .populate("restaurant", "name")   // تجيب اسم المطعم فقط
            .populate("order", "contactNumber status") // تجيب بيانات من الأوردر
            .sort({ createdAt: -1 }); // الأحدث أولاً

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error: error.message,
        });
    }
};



export const getNotificationsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // جلب الإشعارات الخاصة بالمطعم
        const notifications = await NotificationModell.find({ restaurant: doctorId })
            .populate("restaurant", "name")   // تجيب اسم المطعم فقط

            .sort({ createdAt: -1 }); // الأحدث أولاً

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error: error.message,
        });
    }
};

// 🏠 جلب الإشعارات الخاصة بالعقار
export const getNotificationsByProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        // جلب الإشعارات الخاصة بالعقار
        const notifications = await NotificationModell.find({ order: propertyId })
            .populate("order", "title location price")   // يجيب بيانات العقار
            .sort({ createdAt: -1 }); // الأحدث أولاً

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error) {
        console.error("❌ Error fetching property notifications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch property notifications",
            error: error.message,
        });
    }
};





export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // تحديث كل الإشعارات الخاصة بالمطعم كـ "مقروءة"
        const result = await NotificationModell.updateMany(
            { restaurant: restaurantId, isRead: false }, // فقط غير المقروء
            { $set: { isRead: true } }
        );

        res.status(200).json({
            success: true,
            message: "✅ تم تعليم كل الإشعارات كمقروءة",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("❌ Error marking notifications as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark notifications as read",
            error: error.message,
        });
    }
};


export const markAllNotificationsAsReadDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // تحديث كل الإشعارات الخاصة بالمطعم كـ "مقروءة"
        const result = await NotificationModell.updateMany(
            { restaurant: doctorId, isRead: false }, // فقط غير المقروء
            { $set: { isRead: true } }
        );

        res.status(200).json({
            success: true,
            message: "✅ تم تعليم كل الإشعارات كمقروءة",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("❌ Error marking notifications as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark notifications as read",
            error: error.message,
        });
    }
};

// 🏠 تعليم جميع إشعارات العقار كمقروءة
export const markAllNotificationsAsReadProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        // تحديث كل الإشعارات الخاصة بالعقار كـ "مقروءة"
        const result = await NotificationModell.updateMany(
            { order: propertyId, isRead: false }, // فقط الغير مقروء
            { $set: { isRead: true } }
        );

        res.status(200).json({
            success: true,
            message: "✅ تم تعليم كل الإشعارات الخاصة بالعقار كمقروءة",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("❌ Error marking property notifications as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark property notifications as read",
            error: error.message,
        });
    }
};

// export const getRestaurantOrders = asyncHandelr(async (req, res, next) => {
//     const { restaurantId } = req.params; // ⬅️ ناخد id من params

//     if (!restaurantId) {
//         return next(new Error("يجب إدخال معرف المطعم (restaurantId)", { cause: 400 }));
//     }

//     // ✅ تأكد أن المطعم موجود
//     const restaurant = await RestaurantModell.findById(restaurantId);
//     if (!restaurant) {
//         return next(new Error("المطعم غير موجود", { cause: 404 }));
//     }

//     // ✅ هات كل الأوردرات الخاصة بالمطعم
//     const orders = await OrderModel.find({ restaurant: restaurantId })
//         .sort({ createdAt: -1 })
//         .populate("restaurant", "name phone websiteLink") // بيانات المطعم
//         .populate("createdBy", "fullName email"); // بيانات العميل/الي عمل الأوردر

//     if (!orders.length) {
//         return next(new Error("لا توجد طلبات لهذا المطعم", { cause: 404 }));
//     }

//     res.status(200).json({
//         message: "تم جلب الطلبات بنجاح",
//         count: orders.length,
//         data: orders
//     });
// });



export const getRestaurantOrders = asyncHandelr(async (req, res, next) => {
    const { restaurantId } = req.params; // ⬅️ ناخد id من params

    if (!restaurantId) {
        return next(new Error("يجب إدخال معرف المطعم (restaurantId)", { cause: 400 }));
    }

    // ✅ تأكد أن المطعم موجود
    const restaurant = await RestaurantModell.findById(restaurantId);
    if (!restaurant) {
        return next(new Error("المطعم غير موجود", { cause: 404 }));
    }

    // ✅ هات كل الأوردرات الخاصة بالمطعم (واستبعد deleted و created)
    const orders = await OrderModel.find({
        restaurant: restaurantId,
        status: { $nin: ["deleted", "created"] } // 📌 استبعاد الحالتين
    })
        .sort({ createdAt: -1 })
        .populate("restaurant", "name phone websiteLink") // بيانات المطعم
        .populate("createdBy", "fullName email"); // بيانات العميل/الي عمل الأوردر

    if (!orders.length) {
        return next(new Error("لا توجد طلبات لهذا المطعم", { cause: 404 }));
    }

    res.status(200).json({
        message: "تم جلب الطلبات بنجاح",
        count: orders.length,
        data: orders
    });
});




// export const updateOrderStatus = asyncHandelr(async (req, res, next) => {
//     const { orderId } = req.params;
//     const { status } = req.body; // accepted | rejected

//     if (!["accepted", "rejected", "pending", "deleted"].includes(status)) {
//         return res.status(400).json({
//             success: false,
//             message: "❌ الحالة المسموح بها فقط: accepted أو rejected"
//         });
//     }


    

//     const order = await OrderModel.findById(orderId);
//     if (!order) {
//         return res.status(404).json({
//             success: false,
//             message: "❌ الطلب غير موجود"
//         });
//     }

//     if (order.status !== "pending") {
//         return res.status(400).json({
//             success: false,
//             message: `❌ لا يمكن تغيير حالة الطلب لأنه بالفعل ${order.status}`
//         });
//     }

//     order.status = status;
//     await order.save();

//     res.status(200).json({
//         success: true,
//         message: `✅ تم تغيير حالة الطلب إلى ${status}`,
     
//     });
// });
// export const updateOrderStatus = asyncHandelr(async (req, res, next) => {
//     const { orderId } = req.params;
//     let { status, AccountType, Invoice } = req.body;

//     // ✅ الحالات المسموح بها
//     const allowedStatuses = ["accepted", "rejected", "pending", "deleted"];
//     if (!allowedStatuses.includes(status)) {
//         return res.status(400).json({
//             success: false,
//             message: "❌ الحالة المسموح بها فقط: accepted أو rejected أو pending أو deleted"
//         });
//     }

//     // ✅ تجهيز صورة الفاتورة
//     let InvoicePicture = {};
//     if (req.files?.image) {
//         const uploaded = await cloud.uploader.upload(req.files.image[0].path, {
//             folder: "orders/invoices"
//         });
//         InvoicePicture = {
//             secure_url: uploaded.secure_url,
//             public_id: uploaded.public_id
//         };
//     }

//     // ✅ تحديث الطلب
//     const order = await OrderModel.findByIdAndUpdate(
//         orderId,
//         {
//             status,
//             AccountType: AccountType || "",
//             Invoice: Invoice || "notPaid",
//             ...(Object.keys(InvoicePicture).length > 0 && { InvoicePicture })
//         },
//         { new: true }
//     );

//     if (!order) {
//         return res.status(404).json({
//             success: false,
//             message: "❌ الطلب غير موجود"
//         });
//     }

//     res.status(200).json({
//         success: true,
//         message: `✅ تم تغيير حالة الطلب إلى ${status}`,
//         data: order
//     });
// });



// export const updateOrderStatus = asyncHandelr(async (req, res, next) => {
//     const { orderId } = req.params;
//     let { status, AccountType, Invoice } = req.body;

//     // ✅ الحالات المسموح بها
//     const allowedStatuses = ["accepted", "rejected", "pending", "deleted"];
//     if (!allowedStatuses.includes(status)) {
//         return res.status(400).json({
//             success: false,
//             message: "❌ الحالة المسموح بها فقط: accepted أو rejected أو pending أو deleted"
//         });
//     }

//     // ✅ جلب الطلب قبل التحديث للتحقق من حالته
//     const existingOrder = await OrderModel.findById(orderId);
//     if (!existingOrder) {
//         return res.status(404).json({
//             success: false,
//             message: "❌ الطلب غير موجود"
//         });
//     }

//     // 🚫 لو الطلب حالته accepted ومطلوب يتحذف → نمنع التعديل
//     if (existingOrder.status === "accepted" && status === "deleted") {
//         return res.status(400).json({
//             success: false,
//             message: "❌ تمت الموافقة على الطلب ولا يمكنك حذفه"
//         });
//     }

//     // ✅ تجهيز صورة الفاتورة
//     let InvoicePicture = {};
//     if (req.files?.image) {
//         const uploaded = await cloud.uploader.upload(req.files.image[0].path, {
//             folder: "orders/invoices"
//         });
//         InvoicePicture = {
//             secure_url: uploaded.secure_url,
//             public_id: uploaded.public_id
//         };
//     }

//     // ✅ تحديث الطلب
//     const order = await OrderModel.findByIdAndUpdate(
//         orderId,
//         {
//             status,
//             AccountType: AccountType || "",
//             Invoice: Invoice || "notPaid",
//             ...(Object.keys(InvoicePicture).length > 0 && { InvoicePicture })
//         },
//         { new: true }
//     );

//     res.status(200).json({
//         success: true,
//         message: `✅ تم تغيير حالة الطلب إلى ${status}`,
//         data: order
//     });
// });




export const updateOrderStatus = asyncHandelr(async (req, res, next) => {
    const { orderId } = req.params;
    let { status, AccountType, Invoice } = req.body;

    const allowedStatuses = ["accepted", "rejected", "pending", "deleted"];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "❌ الحالة المسموح بها فقط: accepted أو rejected أو pending أو deleted"
        });
    }

    // ✅ جلب الطلب قبل التحديث
    const existingOrder = await OrderModel.findById(orderId)
        .populate("createdBy", "name fcmToken")
        .populate("restaurant", "name");

    if (!existingOrder) {
        return res.status(404).json({
            success: false,
            message: "❌ الطلب غير موجود"
        });
    }

    // 🚫 منع حذف الطلب بعد الموافقة عليه
    if (existingOrder.status === "accepted" && status === "deleted") {
        return res.status(400).json({
            success: false,
            message: "❌ تمت الموافقة على الطلب ولا يمكنك حذفه"
        });
    }

    // ✅ تجهيز صورة الفاتورة (اختياري)
    let InvoicePicture = {};
    if (req.files?.image) {
        const uploaded = await cloud.uploader.upload(req.files.image[0].path, {
            folder: "orders/invoices"
        });
        InvoicePicture = {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id
        };
    }

    // ✅ تحديث الطلب في قاعدة البيانات
    const order = await OrderModel.findByIdAndUpdate(
        orderId,
        {
            status,
            AccountType: AccountType || "",
            Invoice: Invoice || "notPaid",
            ...(Object.keys(InvoicePicture).length > 0 && { InvoicePicture })
        },
        { new: true }
    );

    // 🔔 إرسال إشعار للعميل إذا تم قبول الطلب
    if (status === "accepted" && existingOrder.createdBy?.fcmToken) {
        try {
            await admin.messaging().send({
                notification: {
                    title: "🍽️ تم قبول طلبك!",
                    body: `المطعم وافق على طلبك وجاري التجهيز 🍲`,
                },
                data: {
                    orderId: order._id.toString(),
                    restaurantId: existingOrder.restaurant?._id?.toString() || "",
                    status: "accepted"
                },
                token: existingOrder.createdBy.fcmToken,
            });

            // 🗂️ حفظ الإشعار في قاعدة البيانات
            await NotificationModell.create({
                user: existingOrder.createdBy._id,
                order: order._id,
                title: "🍽️ تم قبول طلبك",
                body: `المطعم وافق على طلبك وجاري التجهيز`,
                fcmToken: existingOrder.createdBy.fcmToken,
            });
        } catch (error) {
            console.error("❌ فشل إرسال إشعار للعميل:", error);
        }
    }

    res.status(200).json({
        success: true,
        message: `✅ تم تغيير حالة الطلب إلى ${status}`,
        data: order
    });
});













export const sendotpphone = asyncHandelr(async (req, res, next) => {
    const { phone } = req.body;

    const checkuser = await dbservice.findOne({
        model: Usermodel,
        filter: {
            mobileNumber: phone,  
            isConfirmed: true
        },
    });

    if (!checkuser) {
        return next(new Error("Phone not exist", { cause: 400 }));
    }

    try {
        await sendOTP(phone); 
        console.log(`📩 OTP تم إرساله إلى ${phone}`);
    } catch (error) {
        console.error("❌ فشل في إرسال OTP:", error.message);
        return next(new Error("Failed to send OTP", { cause: 500 }));
    }

    return successresponse(res, "User found successfully, OTP sent!", 201);
});


export const getMyRestaurantsProducts = asyncHandelr(async (req, res, next) => {
    const { restaurantId } = req.params;

    if (!restaurantId) {
        return next(new Error("رقم المطعم مطلوب", { cause: 400 }));
    }

    // ✅ تحقق إن المطعم موجود والمستخدم مالك أو Manager فيه
    const restaurant = await RestaurantModell.findOne({
        _id: restaurantId,
        $or: [
            { createdBy: req.user._id },
            { "authorizedUsers.user": req.user._id, "authorizedUsers.role": "manager" }
        ]
    });

    if (!restaurant) {
        return next(new Error("غير مصرح لك بعرض منتجات هذا المطعم", { cause: 403 }));
    }

    // 📦 هات المنتجات الخاصة بالمطعم
    const products = await ProductModell.find({ restaurant: restaurantId })
        .sort({ createdAt: -1 })
        .populate("restaurant", "name cuisine")
        .populate("createdBy", "fullName email");

    res.status(200).json({
        message: "تم جلب المنتجات بنجاح",
        count: products.length,
        data: products
    });
});




export const signupwithGmail = asyncHandelr(async (req, res, next) => {
    const { idToken } = req.body;
    const client = new OAuth2Client();

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CIENT_ID,
        });
        return ticket.getPayload();
    }

    const payload = await verify();
    console.log("Google Payload Data:", payload);

    const { name, email, email_verified, picture } = payload;

    if (!email) {
        return next(new Error("Email is missing in Google response", { cause: 400 }));
    }
    if (!email_verified) {
        return next(new Error("Email not verified", { cause: 404 }));
    }

    let user = await dbservice.findOne({
        model: Usermodel,
        filter: { email },
    });

    if (user?.provider === providerTypes.system) {
        return next(new Error("Invalid account", { cause: 404 }));
    }

    if (!user) {
        user = await dbservice.create({
            model: Usermodel,
            data: {
                email,
                username: name,
                profilePic: { secure_url: picture },
                isConfirmed: email_verified,
                provider: providerTypes.google,
            },
        });
    }

    const access_Token = generatetoken({
        payload: { id: user._id },
        signature: user?.role === roletypes.Admin ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN,
    });

    const refreshToken = generatetoken({
        payload: { id: user._id },
        signature: user?.role === roletypes.Admin ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
        expiresIn: 31536000,
    });

    return successresponse(res, "Login successful", 200, { access_Token, refreshToken });
});

export const registerRestaurant = asyncHandelr(async (req, res, next) => {
    const { fullName, email, phone,  subdomain, password } = req.body;

    // ✅ تحقق من تكرار subdomain و email
    const checkuser = await dbservice.findOne({
        model: Usermodel,
        filter: {
            $or: [{ subdomain }, { email }]
        }
    });

    if (checkuser) {
        if (checkuser.subdomain === subdomain) {
            return next(new Error("subdomain already exists", { cause: 400 }));
        }
        if (checkuser.email === email) {
            return next(new Error("email already exists", { cause: 400 }));
        }
    }

    // ✅ تشفير كلمة المرور
    const hashpassword = await generatehash({ planText: password });

    // ✅ إنشاء المستخدم الجديد
    const user = await dbservice.create({
        model: Usermodel,
        data: {
            fullName,
            password: hashpassword,
            email,
            phone,
          
            subdomain
        }
    });

    // ✅ بناء الرابط الديناميكي تلقائيًا
    const restaurantLink = `https://morezk12.github.io/Restaurant-system/#/restaurant/${user.subdomain}`;

    // ✅ دمج كل البيانات داخل كائن واحد لأن دالتك بتتعامل مع message فقط
    const allData = {
        message: "User created successfully",
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        // country: user.country,
        subdomain: user.subdomain,
        restaurantLink
    };
    Emailevent.emit("confirmemail", { email });
    // ✅ رجع كل البيانات داخل message عشان دالتك
    return successresponse(res, allData, 201);
});
  
export const createBranch = asyncHandelr(async (req, res, next) => {
    const {
        branchCode,
        branchName,
        country,
        city,
        phone,
        address,
        manager
    } = req.body;

    const userId = req.user.id; // لو عندك حماية بالتوكن

    const branch = await BranchModel.create({
        restaurant: userId,
        branchCode,
        branchName,
        country,
        city,
        phone,
        address,
        manager
    });

    return successresponse(res, {
        message: 'Branch created successfully',
        branch
    }, 201);
});

export const getBranches = asyncHandelr(async (req, res, next) => {
    const userId = req.user.id; // لو عامل حماية بالتوكن

    // 📌 تحديد الصفحة الحالية وعدد العناصر في كل صفحة
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // 📌 إجمالي عدد الفروع الخاصة بالمطعم
    const totalBranches = await BranchModel.countDocuments({ restaurant: userId });

    // 📌 جلب الفروع مع الباجينيشن
    const branches = await BranchModel.find({ restaurant: userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // ترتيب من الأحدث للأقدم (اختياري)

    return successresponse(res, {
        message: "Branches fetched successfully",
        page,
        totalPages: Math.ceil(totalBranches / limit),
        totalBranches,
        count: branches.length,
        branches
    });
});
export const deleteBranch = asyncHandelr(async (req, res, next) => {
    const branchId = req.params.id;
    const userId = req.user.id;

    const branch = await BranchModel.findOneAndDelete({
        _id: branchId,
        restaurant: userId // تأكيد أن الفرع يخص نفس المستخدم
    });

    if (!branch) {
        return next(new Error("❌ الفرع غير موجود أو لا تملك صلاحية حذفه", { cause: 404 }));
    }

    return successresponse(res, {
        message: "✅ تم حذف الفرع بنجاح",
        branch
    });
});
export const updateBranch = asyncHandelr(async (req, res, next) => {
    const branchId = req.params.id;
    const userId = req.user.id;

    const updateData = {
        branchCode: req.body.branchCode,
        branchName: req.body.branchName,
        country: req.body.country,
        city: req.body.city,
        phone: req.body.phone,
        address: req.body.address,
        manager: req.body.manager
    };

    const branch = await BranchModel.findOneAndUpdate(
        { _id: branchId, restaurant: userId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!branch) {
        return next(new Error("❌ الفرع غير موجود أو لا تملك صلاحية تعديله", { cause: 404 }));
    }

    return successresponse(res, {
        message: "✅ تم تعديل بيانات الفرع بنجاح",
        branch
    });
});


export const confirmOTP = asyncHandelr(
    async (req, res, next) => {
        const { code, email } = req.body;


        const user = await dbservice.findOne({ model: Usermodel, filter: { email } })
        if (!user) {
            return next(new Error("Email does not exist tmm", { cause: 404 }));
        }


        if (user.blockUntil && Date.now() < new Date(user.blockUntil).getTime()) {
            const remainingTime = Math.ceil((new Date(user.blockUntil).getTime() - Date.now()) / 1000);
            return next(new Error(`Too many attempts. Please try again after ${remainingTime} seconds.`, { cause: 429 }));
        }


        if (user.isConfirmed) {
            return next(new Error("Email is already confirmed", { cause: 400 }));
        }


        if (Date.now() > new Date(user.otpExpiresAt).getTime()) {
            return next(new Error("OTP has expired", { cause: 400 }));
        }


        const isValidOTP = comparehash({ planText: `${code}`, valuehash: user.emailOTP });
        if (!isValidOTP) {

            await dbservice.updateOne({ model: Usermodel, data: { $inc: { attemptCount: 1 } } })


            if (user.attemptCount + 1 >= 5) {
                const blockUntil = new Date(Date.now() + 2 * 60 * 1000);
                await Usermodel.updateOne({ email }, { blockUntil, attemptCount: 0 });
                return next(new Error("Too many attempts. You are temporarily blocked for 2 minutes.", { cause: 429 }));
            }

            return next(new Error("Invalid OTP. Please try again.", { cause: 400 }));
        }


        await Usermodel.updateOne(
            { email },
            {

                isConfirmed: true,
                $unset: { emailOTP: 0, otpExpiresAt: 0, attemptCount: 0, blockUntil: 0 },
            }
        );
        const access_Token = generatetoken({
            payload: { id: user._id },
            // signature: user.role === roletypes.Admin ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN,
        });

        const refreshToken = generatetoken({
            payload: { id: user._id },
            // signature: user.role === roletypes.Admin ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
            expiresIn: "365d"
        });

        return successresponse(res, "Email confirmed successfully", 200, { access_Token, refreshToken });
    }
);



export const createMainGroup = asyncHandelr(async (req, res) => {
    const { name, status } = req.body;
    const userId = req.user.id;

    const group = await MainGroupModel.create({
        name,
        status,
        createdBy: userId
    });

    res.status(201).json({
        message: "✅ تم إنشاء المجموعة الرئيسية بنجاح",
        group
    });
});

export const createSubGroup = asyncHandelr(async (req, res) => {
    const { name, mainGroupId } = req.body;
    const userId = req.user.id;

    // تحقق أن المجموعة الرئيسية موجودة ومملوكة لنفس المستخدم
    const mainGroup = await MainGroupModel.findOne({
        _id: mainGroupId,
        createdBy: userId
    });

    if (!mainGroup) {
        res.status(404);
        throw new Error("❌ لا يمكنك إنشاء مجموعة فرعية بدون صلاحية على المجموعة الرئيسية");
    }

    const subGroup = await SubGroupModel.create({
        name,
        mainGroup: mainGroupId,
        createdBy: userId
    });

    res.status(201).json({
        message: "✅ تم إنشاء المجموعة الفرعية بنجاح",
        subGroup
    });
});

export const getMainGroupsForUser = asyncHandelr(async (req, res) => {
    const userId = req.user.id;

    const mainGroups = await MainGroupModel.find({ createdBy: userId })
        .select("name status createdAt");

    res.status(200).json({
        message: "✅ تم جلب المجموعات الرئيسية",
        count: mainGroups.length,
        mainGroups
    });
});

export const getMainGroupsWithSubGroups = asyncHandelr(async (req, res) => {
    const userId = req.user.id;

    // جلب كل المجموعات الرئيسية الخاصة بالمستخدم
    const mainGroups = await MainGroupModel.find({ createdBy: userId })
        .select("name status createdAt")
        .lean();

    // جلب كل المجموعات الفرعية الخاصة بالمستخدم
    const allSubGroups = await SubGroupModel.find({ createdBy: userId })
        .select("name mainGroup")
        .lean();

    // ربط المجموعات الفرعية مع كل مجموعة رئيسية
    const result = mainGroups.map(mainGroup => {
        const subGroups = allSubGroups.filter(
            sub => sub.mainGroup.toString() === mainGroup._id.toString()
        );

        return {
            _id: mainGroup._id,
            name: mainGroup.name,
            status: mainGroup.status,
            subGroups,
            subGroupCount: subGroups.length
        };
    });

    res.status(200).json({
        message: "✅ تم جلب المجموعات الرئيسية مع المجموعات الفرعية",
        count: result.length,
        totalSubGroups: allSubGroups.length,
        data: result
    });
});

export const deleteMainGroup = asyncHandelr(async (req, res) => {
    const mainGroupId = req.params.id;
    const userId = req.user.id;

    const mainGroup = await MainGroupModel.findOneAndDelete({
        _id: mainGroupId,
        createdBy: userId
    });

    if (!mainGroup) {
        res.status(404);
        throw new Error("❌ لم يتم العثور على المجموعة أو لا تملك صلاحية الحذف");
    }

    // حذف جميع المجموعات الفرعية المرتبطة
    await SubGroupModel.deleteMany({ mainGroup: mainGroupId });

    res.status(200).json({
        message: "✅ تم حذف المجموعة الرئيسية وجميع المجموعات الفرعية التابعة لها"
    });
});


export const deleteSubGroup = asyncHandelr(async (req, res) => {
    const subGroupId = req.params.id;
    const userId = req.user.id;

    const subGroup = await SubGroupModel.findOneAndDelete({
        _id: subGroupId,
        createdBy: userId
    });

    if (!subGroup) {
        res.status(404);
        throw new Error("❌ لم يتم العثور على المجموعة الفرعية أو لا تملك صلاحية الحذف");
    }

    res.status(200).json({
        message: "✅ تم حذف المجموعة الفرعية بنجاح"
    });
});


export const updateMainGroup = asyncHandelr(async (req, res) => {
    const mainGroupId = req.params.id;
    const userId = req.user.id;
    const { name, status } = req.body;

    const updated = await MainGroupModel.findOneAndUpdate(
        { _id: mainGroupId, createdBy: userId },
        { name, status },
        { new: true, runValidators: true }
    );

    if (!updated) {
        res.status(404);
        throw new Error("❌ لا تملك صلاحية التعديل أو المجموعة غير موجودة");
    }

    res.status(200).json({
        message: "✅ تم تعديل المجموعة الرئيسية بنجاح",
        updated
    });
});

export const updateSubGroup = asyncHandelr(async (req, res) => {
    const subGroupId = req.params.id;
    const userId = req.user.id;
    const { name, mainGroupId } = req.body;

    // تأكد أن المستخدم يملك المجموعة الرئيسية الجديدة (إن تم تعديلها)
    if (mainGroupId) {
        const mainGroup = await MainGroupModel.findOne({
            _id: mainGroupId,
            createdBy: userId
        });
        if (!mainGroup) {
            res.status(403);
            throw new Error("❌ لا تملك صلاحية ربط بهذه المجموعة الرئيسية");
        }
    }

    const updated = await SubGroupModel.findOneAndUpdate(
        { _id: subGroupId, createdBy: userId },
        { name, mainGroup: mainGroupId },
        { new: true, runValidators: true }
    );

    if (!updated) {
        res.status(404);
        throw new Error("❌ لا تملك صلاحية التعديل أو المجموعة غير موجودة");
    }

    res.status(200).json({
        message: "✅ تم تعديل المجموعة الفرعية بنجاح",
        updated
    });
});


export const getMySubGroups = asyncHandelr(async (req, res) => {
    const userId = req.user.id;

    const subGroups = await SubGroupModel.find({ createdBy: userId })
        .populate("mainGroup", "name") // يمكنك تعديل الحقول التي تود جلبها من المجموعة الرئيسية
        .sort({ createdAt: -1 }); // ترتيب تنازلي حسب تاريخ الإنشاء

    res.status(200).json({
        message: "✅ تم جلب المجموعات الفرعية الخاصة بك بنجاح",
        count: subGroups.length,
        subGroups,
    });
});



export const createPermissions = asyncHandelr(async (req, res) => {
    // const userId = req.user.id;
    const { name, description } = req.body;

    if (!name) {
        res.status(400);
        throw new Error("❌ يجب إدخال اسم الصلاحية");
    }

    const existing = await PermissionModel.findOne({ name: name.toLowerCase().trim() });

    if (existing) {
        res.status(400);
        throw new Error("❌ هذه الصلاحية موجودة بالفعل");
    }

    const created = await PermissionModel.create({
        name: name.toLowerCase().trim(),
        description,
        // createdBy: userId
    });

    res.status(201).json({
        message: "✅ تم إنشاء الصلاحية",
        permission: created
    });
});
export const getAllPermissions = asyncHandelr(async (req, res) => {
    // const userId = req.user.id;

    const permissions = await PermissionModel.find();

    res.status(200).json({
        message: "✅ الصلاحيات الخاصة بك",
        count: permissions.length,
        permissions
    });
});

// controllers/permission.controller.js

export const deletePermission = asyncHandelr(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const permission = await PermissionModel.findOneAndDelete({
        _id: id,
        createdBy: userId
    });

    if (!permission) {
        res.status(404);
        throw new Error("❌ الصلاحية غير موجودة أو ليس لديك صلاحية لحذفها");
    }

    res.status(200).json({
        message: "✅ تم حذف الصلاحية بنجاح",
        deletedId: permission._id
    });
});

export const updatePermission = asyncHandelr(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description } = req.body;

    const updated = await PermissionModel.findOneAndUpdate(
        { _id: id, createdBy: userId },
        {
            ...(name && { name: name.toLowerCase().trim() }),
            ...(description && { description })
        },
        { new: true, runValidators: true }
    );

    if (!updated) {
        res.status(404);
        throw new Error("❌ الصلاحية غير موجودة أو ليس لديك صلاحية لتعديلها");
    }

    res.status(200).json({
        message: "✅ تم تعديل الصلاحية بنجاح",
        permission: updated
    });
});

// export const createAdminUser = asyncHandelr(async (req, res) => {
//     const createdBy = req.user.id; // صاحب المطعم من التوكن

//     const {
//         name,
//         phone,
//         password,
//         branch,
//         mainGroup,
//         subGroup,
//         permissions
//     } = req.body;

//     if (!name || !phone || !password || !branch || !mainGroup || !subGroup || !permissions) {
//         res.status(400);
//         throw new Error("❌ كل الحقول مطلوبة");
//     }

//     // تحقق إن الهاتف مش مكرر
//     const exists = await AdminUserModel.findOne({ phone });
//     if (exists) {
//         res.status(400);
//         throw new Error("❌ هذا الرقم مستخدم بالفعل");
//     }

//     const admin = await AdminUserModel.create({
//         name,
//         phone,
//         password,
//         branch,
//         mainGroup,
//         subGroup,
//         permissions,
//         createdBy
//     });

//     res.status(201).json({
//         message: "✅ تم إنشاء الأدمن بنجاح",
//         admin: {
//             _id: admin._id,
//             name: admin.name,
//             phone: admin.phone,
//             branch: admin.branch,
//             mainGroup: admin.mainGroup,
//             subGroup: admin.subGroup,
//             permissions: admin.permissions
//         }
//     });
// });




export const createAdminUser = asyncHandelr(async (req, res) => {
    const createdBy = req.user.id;
    const {
        name, phone, email,password, branch,
        mainGroup, subGroup, permissions
    } = req.body;

    if (
        !name || !phone || !password ||
        !email ||
        !Array.isArray(branch) ||
        !Array.isArray(mainGroup) ||
        !Array.isArray(subGroup) ||
        !Array.isArray(permissions)
    ) {
        res.status(400);
        throw new Error("❌ جميع الحقول مطلوبة ويجب أن تكون المجموعات والفروع والصلاحيات في صورة Array");
    }




    const exists = await AdminUserModel.findOne({ email });
    if (exists) {
        res.status(400);
        throw new Error("❌ هذا الرقم مستخدم بالفعل");
    }

    // ✅ رفع الصورة من req.files.image[0]
    let uploadedImage = null;
    const imageFile = req.files?.image?.[0];
    if (imageFile) {
        const uploaded = await cloud.uploader.upload(imageFile.path, {
            folder: `adminUsers/${createdBy}`
        });
        uploadedImage = {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id
        };
    }

    const admin = await AdminUserModel.create({
        name,
        phone,
        email,
        password,
        branch,
        mainGroup,
        subGroup,
        permissions,
        profileImage: uploadedImage,
        createdBy
    });

    res.status(201).json({
        message: "✅ تم إنشاء الأدمن بنجاح",
        admin: {
            _id: admin._id,
            name: admin.name,
            phone: admin.phone,
            branch: admin.branch,
            email: admin.email,
            profileImage: admin.profileImage,
            permissions: admin.permissions
        }
    });
});






export const getAllAdminUsers = asyncHandelr(async (req, res) => {
    const createdBy = req.user.id;

    const admins = await AdminUserModel.find({ createdBy })
        .populate("branch", "branchName")        // فك اسم الفرع
        .populate("mainGroup", "name")           // فك اسم المجموعة الرئيسية
        .populate("subGroup", "name")            // فك اسم المجموعة الفرعية
        .populate("permissions", "name description"); // فك الصلاحيات

    res.status(200).json({
        message: "✅ الأدمنات التابعين لك",
        count: admins.length,
        admins
    });
});

export const getSubGroupsByMainGroup = asyncHandelr(async (req, res, next) => {
    const userId = req.user.id;
    const { mainGroupId } = req.params;

    if (!mainGroupId) {
        return next(new Error("❌ يجب إرسال معرف المجموعة الرئيسية", { cause: 400 }));
    }

    // تأكد إن المجموعة الرئيسية فعلاً ملك المستخدم
    const mainGroup = await MainGroupModel.findOne({ _id: mainGroupId, createdBy: userId });

    if (!mainGroup) {
        return next(new Error("❌ لا تملك صلاحية الوصول لهذه المجموعة الرئيسية أو غير موجودة", { cause: 404 }));
    }

    // جلب المجموعات الفرعية التابعة لها
    const subGroups = await SubGroupModel.find({ mainGroup: mainGroupId, createdBy: userId })
        .select("name createdAt")
        .lean();

    res.status(200).json({
        message: "✅ تم جلب المجموعات الفرعية الخاصة بهذه المجموعة الرئيسية",
        count: subGroups.length,
        mainGroup: {
            _id: mainGroup._id,
            name: mainGroup.name
        },
        subGroups
    });
});


export const deleteAdminUser = asyncHandelr(async (req, res) => {
    const adminId = req.params.id;
    const userId = req.user.id; // صاحب المطعم

    const admin = await AdminUserModel.findOneAndDelete({
        _id: adminId,
        createdBy: userId
    });

    if (!admin) {
        res.status(404);
        throw new Error("❌ لم يتم العثور على الأدمن أو ليس لديك صلاحية الحذف");
    }

    res.status(200).json({
        message: "✅ تم حذف الأدمن بنجاح"
    });
});

export const updateAdminUser = asyncHandelr(async (req, res) => {
    const adminId = req.params.id;
    const userId = req.user.id;

    const {
        name, phone, email, password,
        branch, mainGroup, subGroup, permissions
    } = req.body;

    const oldAdmin = await AdminUserModel.findOne({ _id: adminId, createdBy: userId });
    if (!oldAdmin) {
        res.status(404);
        throw new Error("❌ لم يتم العثور على الأدمن أو ليس لديك صلاحية التعديل");
    }

    // دمج الأريهات
    const mergeArray = (oldArray = [], newArray = []) => {
        if (!Array.isArray(newArray)) return oldArray;
        const filtered = oldArray.filter(item => newArray.includes(item));
        const added = newArray.filter(item => !filtered.includes(item));
        return [...filtered, ...added];
    };

    const updatedData = {
        name: name || oldAdmin.name,
        phone: phone || oldAdmin.phone,
        email: email || oldAdmin.email,
        password: password || oldAdmin.password,
        branch: mergeArray(oldAdmin.branch, branch),
        mainGroup: mergeArray(oldAdmin.mainGroup, mainGroup),
        subGroup: mergeArray(oldAdmin.subGroup, subGroup),
        permissions: mergeArray(oldAdmin.permissions, permissions)
    };

    // رفع صورة جديدة إن وجدت
    const imageFile = req.files?.image?.[0];
    if (imageFile) {
        const uploaded = await cloud.uploader.upload(imageFile.path, {
            folder: `adminUsers/${userId}`
        });
        updatedData.profileImage = {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id
        };
    }

    const updatedAdmin = await AdminUserModel.findOneAndUpdate(
        { _id: adminId, createdBy: userId },
        updatedData,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        message: "✅ تم تحديث بيانات الأدمن بنجاح",
        admin: updatedAdmin
    });
});

export const createQuestion = asyncHandelr(async (req, res) => {
    const userId = req.user.id;
    const { questions, mainGroup, subGroup, isActive } = req.body;

    if (!mainGroup || !subGroup) {
        res.status(400);
        throw new Error("❌ يجب تحديد المجموعة الرئيسية والفرعية");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        res.status(400);
        throw new Error("❌ يجب إرسال مصفوفة من الأسئلة");
    }

    const formattedQuestions = questions.map(q => {
        if (!q.questionText?.ar || !q.questionText?.en || !q.evaluation) {
            throw new Error("❌ كل سؤال يجب أن يحتوي على questionText و evaluation");
        }

        // ✅ الحل هنا باستخدام new
        return {
            questionText: q.questionText,
            evaluation: new mongoose.Types.ObjectId(q.evaluation)
        };
    });

    const created = await QuestionModel.create({
        questions: formattedQuestions,
        mainGroup,
        subGroup,
        isActive: isActive ?? true,
        createdBy: userId
    });

    res.status(201).json({
        message: "✅ تم إنشاء الأسئلة في مستند واحد بنجاح",
        data: created
    });
});


export const getQuestionsByMainGroups = asyncHandelr(async (req, res) => {
    const userId = req.user.id;

    // جلب كل المجموعات الرئيسية الخاصة بالمستخدم
    const mainGroups = await MainGroupModel.find({ createdBy: userId }).lean();

    // جلب كل المجموعات الفرعية الخاصة بالمستخدم
    const subGroups = await SubGroupModel.find({ createdBy: userId }).lean();

    // ✅ جلب الأسئلة ومعاها التقييم داخل كل سؤال في المصفوفة
    const questions = await QuestionModel.find({ createdBy: userId })
        .populate("questions.evaluation") // ✅ تم التعديل هنا فقط
        .lean();

    const data = mainGroups.map(main => {
        // جلب المجموعات الفرعية التابعة للمجموعة الرئيسية الحالية
        const relatedSubGroups = subGroups
            .filter(sub => sub.mainGroup.toString() === main._id.toString())
            .map(sub => {
                // جلب الأسئلة المرتبطة بهذه المجموعة الفرعية
                const relatedQuestions = questions.filter(q =>
                    q.subGroup.toString() === sub._id.toString()
                );

                return {
                    _id: sub._id,
                    name: sub.name,
                    questions: relatedQuestions
                };
            });

        // حساب عدد الأسئلة في كل المجموعات الفرعية
        const totalQuestions = relatedSubGroups.reduce((acc, sub) => acc + sub.questions.length, 0);

        if (totalQuestions > 0) {
            return {
                _id: main._id,
                name: main.name,
                subGroups: relatedSubGroups
            };
        }

        return null; // تجاهل المجموعات الرئيسية التي لا تحتوي على أي أسئلة
    }).filter(Boolean); // إزالة القيم الفارغة

    res.status(200).json({
        message: "✅ تم جلب المجموعات الرئيسية والفرعية مع الأسئلة",
        count: data.length,
        data
    });
});

export const createEvaluation = asyncHandelr(async (req, res) => {
    const { title, statuses } = req.body;
    const createdBy = req.user._id;

    if (!title || !Array.isArray(statuses) || statuses.length === 0) {
        res.status(400);
        throw new Error("❌ العنوان مطلوب ويجب إدخال حالة تقييم واحدة على الأقل");
    }

    const evaluation = await EvaluationModel.create({
        title,
        statuses,
        createdBy
    });

    res.status(201).json({
        message: "✅ تم إنشاء التقييم بنجاح",
        evaluation
    });
});


// ✅ GET: جلب جميع التقييمات الخاصة بالمستخدم
export const getEvaluations = asyncHandelr(async (req, res) => {
    const createdBy = req.user._id;

    const evaluations = await EvaluationModel.find({ createdBy });

    res.status(200).json({
        message: "✅ تم جلب التقييمات",
        count: evaluations.length,
        data: evaluations
    });
});


export const deleteSingleQuestion = asyncHandelr(async (req, res) => {
    const { mainId, questionId } = req.params;

    const updated = await QuestionModel.findByIdAndUpdate(
        mainId,
        {
            $pull: {
                questions: { _id: questionId }
            }
        },
        { new: true }
    );

    if (!updated) {
        res.status(404);
        throw new Error("❌ لم يتم العثور على السؤال أو المستند");
    }

    res.status(200).json({
        message: "✅ تم حذف السؤال بنجاح",
        data: updated
    });
});


export const updateSingleQuestion = asyncHandelr(async (req, res) => {
    const { mainId, questionId } = req.params; // mainId هو ID المستند الرئيسي
    const { questionText, evaluation } = req.body;

    const question = await QuestionModel.findOneAndUpdate(
        {
            _id: mainId,
            "questions._id": questionId
        },
        {
            $set: {
                "questions.$.questionText": questionText,
                "questions.$.evaluation": new mongoose.Types.ObjectId(evaluation)
            }
        },
        { new: true }
    );

    if (!question) {
        res.status(404);
        throw new Error("❌ لم يتم العثور على السؤال أو المستند");
    }

    res.status(200).json({
        message: "✅ تم تحديث السؤال بنجاح",
        data: question
    });
});


export const createMode = async (req, res) => {
    try {
        const { managerName, subGroups, locationId } = req.body;
        const userId = req.user?._id;
        if (!managerName || !locationId) {
            return res.status(400).json({ message: "البيانات ناقصة" });
        }

        const newMode = new evaluateModel({
            managerName,
            subGroups,
            createdBy: userId,
            locationId,
        });

        await newMode.save();

        res.status(201).json({
            success: true,
            message: "تم إنشاء المود بنجاح",
            data: newMode,
        });
    } catch (error) {
        console.error("❌ خطأ في إنشاء المود:", error);
        res.status(500).json({ success: false, message: "حدث خطأ في السيرفر" });
    }
};


export const getMyEvaluations = async (req, res) => {
    try {
        const userId = req.user.id;

        const evaluations = await evaluateModel.find({ createdBy: userId })
            .populate({
                path: "locationId",
                select: "branchName",
                model: BranchModel
            })
            .populate({
                path: "createdBy",
                select: "fullName",
                model: Usermodel
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "تم جلب كل التقييمات بنجاح",
            count: evaluations.length,
            data: evaluations.map(e => ({
                managerName: e.managerName,
                date: e.createdAt,
                location: e.locationId?.branchName || "غير محدد",
                createdBy: e.createdBy?.fullName || "غير معروف"
            }))
        });
    } catch (error) {
        console.error("❌ خطأ أثناء جلب التقييمات:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ في السيرفر"
        });
    }
};


// ---- Create Supermarket (رفع صورة وبانر)
export const createSupermarket = asyncHandelr(async (req, res, next) => {
    let { name = {}, description = {}, phone, pickup, isOpen, supermarketLocationLink } = req.body;

    // ✅ Parse JSON Strings if needed
    try {
        if (typeof name === "string") name = JSON.parse(name);
        if (typeof description === "string") description = JSON.parse(description);
        if (typeof pickup === "string") pickup = JSON.parse(pickup);
    } catch (err) {
        return next(new Error("خطأ في صيغة JSON للـ name أو description أو pickup", { cause: 400 }));
    }

    // ✅ تحقق من صلاحية المستخدم
    const user = await Usermodel.findById(req.user._id);
    if (!user || user.accountType !== "Owner") {
        return next(new Error("غير مسموح لك بإنشاء سوبر ماركت، يجب أن يكون حسابك Owner", { cause: 403 }));
    }

    // ✅ تحقق من الحقول الأساسية
    const hasName = (name.en || name.fr || name.ar);
    if (!hasName) {
        return next(new Error("اسم السوبر ماركت مطلوب على الأقل بلغة واحدة", { cause: 400 }));
    }

    // ✅ رفع صورة cover
    let uploadedImage = null;
    if (req.files?.image?.[0]) {
        const file = req.files.image[0];
        const uploaded = await cloud.uploader.upload(file.path, { folder: "supermarkets/images" });
        uploadedImage = { secure_url: uploaded.secure_url, public_id: uploaded.public_id };
    }

    // ✅ رفع صور banners
    const uploadedBanners = [];
    if (req.files?.bannerImages) {
        for (const file of req.files.bannerImages) {
            const uploaded = await cloud.uploader.upload(file.path, { folder: "supermarkets/banners" });
            uploadedBanners.push({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });
        }
    }

    // ✅ إنشاء السوبرماركت
    const supermarket = await SupermarketModel.create({
        name,
        description,
        phone,
        supermarketLocationLink,
        pickup, // ← هنا الإحداثيات الجديدة
        image: uploadedImage,
        bannerImages: uploadedBanners,
        isOpen: isOpen ?? true,
        createdBy: req.user._id
    });

    return res.status(201).json({ message: "تم إنشاء السوبر ماركت بنجاح", data: supermarket });
});


export const deleteAppSettings = asyncHandelr(async (req, res, next) => {
    // 🔍 البحث عن الإعدادات الحالية
    const settings = await AppSettingsSchema.findOne();

    // ⚠️ لو مفيش إعدادات
    if (!settings) {
        return next(new Error("❌ لا توجد إعدادات لحذفها", { cause: 404 }));
    }

    // 🗑️ حذف السجل
    await AppSettingsSchema.deleteOne({ _id: settings._id });

    return successresponse(res, "🗑️ تم حذف الإعدادات بنجاح", 200, { deleted: true });
});



export const updateSupermarket = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;
    let { name, description, phone, pickup, isOpen, supermarketLocationLink } = req.body;

    // ✅ Parse JSON Strings if موجودة كسلاسل
    try {
        if (typeof name === "string") name = JSON.parse(name);
        if (typeof description === "string") description = JSON.parse(description);
        if (typeof pickup === "string") pickup = JSON.parse(pickup);
    } catch (err) {
        return next(new Error("خطأ في صيغة JSON للـ name أو description أو pickup", { cause: 400 }));
    }

    // ✅ تحقق من وجود السوبرماركت
    const supermarket = await SupermarketModel.findById(id);
    if (!supermarket) {
        return next(new Error("السوبر ماركت غير موجود", { cause: 404 }));
    }

    // ✅ تحقق من صلاحية المستخدم
    if (supermarket.createdBy.toString() !== req.user._id.toString() && req.user.accountType !== "Admin") {
        return next(new Error("غير مسموح لك بتعديل هذا السوبر ماركت", { cause: 403 }));
    }

    // ✅ تعديل القيم
    if (name) supermarket.name = { ...supermarket.name, ...name };
    if (description) supermarket.description = { ...supermarket.description, ...description };
    if (phone) supermarket.phone = phone;
    if (supermarketLocationLink) supermarket.supermarketLocationLink = supermarketLocationLink;
    if (pickup) supermarket.pickup = pickup;
    if (typeof isOpen !== "undefined") supermarket.isOpen = isOpen;

    // ✅ تحديث صورة الـ cover
    if (req.files?.image?.[0]) {
        // حذف الصورة القديمة من Cloudinary
        if (supermarket.image?.public_id) {
            await cloud.uploader.destroy(supermarket.image.public_id);
        }
        const uploaded = await cloud.uploader.upload(req.files.image[0].path, { folder: "supermarkets/images" });
        supermarket.image = { secure_url: uploaded.secure_url, public_id: uploaded.public_id };
    }

    // ✅ تحديث صور الـ banners (في حال تم رفع صور جديدة)
    if (req.files?.bannerImages) {
        // حذف الصور القديمة
        if (supermarket.bannerImages?.length) {
            for (const banner of supermarket.bannerImages) {
                if (banner.public_id) await cloud.uploader.destroy(banner.public_id);
            }
        }
        // رفع الجديدة
        supermarket.bannerImages = [];
        for (const file of req.files.bannerImages) {
            const uploaded = await cloud.uploader.upload(file.path, { folder: "supermarkets/banners" });
            supermarket.bannerImages.push({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });
        }
    }

    // 💾 حفظ التعديلات
    await supermarket.save();

    return res.status(200).json({
        message: "تم تعديل السوبر ماركت بنجاح ✅",
        data: supermarket
    });
});

















export const deleteSupermarket = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;

    // ✅ تحقق من وجود السوبرماركت
    const supermarket = await SupermarketModel.findById(id);
    if (!supermarket) {
        return next(new Error("السوبر ماركت غير موجود", { cause: 404 }));
    }

    // ✅ تحقق من صلاحية المستخدم
    if (supermarket.createdBy.toString() !== req.user._id.toString() && req.user.accountType !== "Admin") {
        return next(new Error("غير مسموح لك بحذف هذا السوبر ماركت", { cause: 403 }));
    }

    // 🧹 حذف الصور من Cloudinary
    if (supermarket.image?.public_id) {
        await cloud.uploader.destroy(supermarket.image.public_id);
    }

    if (supermarket.bannerImages?.length) {
        for (const banner of supermarket.bannerImages) {
            if (banner.public_id) {
                await cloud.uploader.destroy(banner.public_id);
            }
        }
    }

    // 🗑️ حذف السوبرماركت من قاعدة البيانات
    await SupermarketModel.findByIdAndDelete(id);

    return res.status(200).json({
        message: "تم حذف السوبر ماركت بنجاح ✅",
    });
});








export const updateSection = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;
    let { name = {}, description = {} } = req.body;

    // ✅ تحويل النصوص إلى JSON إذا كانت String
    try {
        if (typeof name === "string") name = JSON.parse(name);
        if (typeof description === "string") description = JSON.parse(description);
    } catch {
        return next(new Error("خطأ في صيغة JSON للـ name أو description", { cause: 400 }));
    }

    // 🔍 البحث عن القسم والتأكد أن المستخدم هو المنشئ
    const section = await SectionModel.findOne({ _id: id, createdBy: req.user._id });
    if (!section) {
        return next(new Error("القسم غير موجود أو ليس لديك صلاحية لتعديله", { cause: 404 }));
    }

    // ✅ التحديث
    if (name && (name.en || name.fr || name.ar)) section.name = name;
    if (description && (description.en || description.fr || description.ar)) section.description = description;

    await section.save();

    return res.status(200).json({
        message: "✅ تم تحديث القسم بنجاح",
        data: section
    });
});


export const deleteSection = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;

    // 🔍 البحث عن القسم
    const section = await SectionModel.findOne({ _id: id, createdBy: req.user._id });
    if (!section) {
        return next(new Error("القسم غير موجود أو ليس لديك صلاحية لحذفه", { cause: 404 }));
    }

    // 🧹 حذف كل المنتجات التابعة للقسم
    const products = await ProductModell.find({ section: id });

    for (const product of products) {
        // 🗑️ حذف صور المنتج من Cloudinary
        if (Array.isArray(product.images)) {
            for (const img of product.images) {
                if (img.public_id) {
                    await cloud.uploader.destroy(img.public_id);
                }
            }
        }
    }

    // حذف المنتجات من قاعدة البيانات
    await ProductModell.deleteMany({ section: id });

    // 🔥 حذف القسم نفسه
    await SectionModel.deleteOne({ _id: id });

    return res.status(200).json({
        message: "🗑️ تم حذف القسم وجميع المنتجات التابعة له بنجاح"
    });
});







export const addSection = asyncHandelr(async (req, res, next) => {
    const { supermarketId } = req.params;
    const { name = {}, description = {} } = req.body;

    const user = await Usermodel.findById(req.user._id);
    if (!user) return next(new Error("غير مصرح", { cause: 403 }));

    // تحقق أن السوبر ماركت موجود
    const sm = await SupermarketModel.findById(supermarketId);
    if (!sm) return next(new Error("السوبر ماركت غير موجود", { cause: 404 }));

    // حقل الاسم مطلوب على الأقل بلغة واحدة
    if (!(name.en || name.fr || name.ar)) {
        return next(new Error("اسم القسم مطلوب على الأقل بلغة واحدة", { cause: 400 }));
    }

    const section = await SectionModel.create({
        supermarket: sm._id,
        name,
        description,
        createdBy: req.user._id
    });

    return res.status(201).json({ message: "تم إضافة القسم", data: section });
});




export const addProduct = asyncHandelr(async (req, res, next) => {
    const { sectionId } = req.params;
    let { name = {}, description = {}, price, discount = 0, stock = 0 } = req.body;

    // ✅ Parse JSON Strings if needed
    try {
        if (typeof name === "string") name = JSON.parse(name);
        if (typeof description === "string") description = JSON.parse(description);
    } catch (err) {
        return next(new Error("خطأ في صيغة JSON للـ name أو description", { cause: 400 }));
    }

    // ✅ validate
    if (!price && price !== 0) return next(new Error("السعر مطلوب", { cause: 400 }));
    if (!(name.en || name.fr || name.ar)) {
        return next(new Error("اسم المنتج مطلوب على الأقل بلغة واحدة", { cause: 400 }));
    }

    // ✅ تحقق أن القسم موجود
    const section = await SectionModel.findById(sectionId);
    if (!section) return next(new Error("القسم غير موجود", { cause: 404 }));

    // ✅ صور المنتج
    const images = [];
    if (req.files?.images) {
        for (const file of req.files.images) {
            const uploaded = await cloud.uploader.upload(file.path, { folder: "supermarkets/products" });
            images.push({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });
        }
    }

    // ✅ إنشاء المنتج
    const product = await ProductModelllll.create({
        supermarket: section.supermarket,
        section: section._id,
        name,
        description,
        images,
        price,
        discount,
        stock,
        createdBy: req.user._id
    });

    return res.status(201).json({ message: "تم إضافة المنتج", data: product });
});







export const updateProductsupermarket = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;
    let { name = {}, description = {}, price, discount, stock } = req.body;

    // ✅ تحويل النصوص إلى JSON لو كانت String
    try {
        if (typeof name === "string") name = JSON.parse(name);
        if (typeof description === "string") description = JSON.parse(description);
    } catch {
        return next(new Error("خطأ في صيغة JSON للـ name أو description", { cause: 400 }));
    }

    // 🔍 البحث عن المنتج والتأكد من صلاحية المستخدم
    const product = await ProductModelllll.findOne({ _id: id, createdBy: req.user._id });
    if (!product) {
        return next(new Error("المنتج غير موجود أو ليس لديك صلاحية لتعديله", { cause: 404 }));
    }

    // ✅ تحديث النصوص والمعلومات
    if (name && (name.en || name.fr || name.ar)) product.name = name;
    if (description && (description.en || description.fr || description.ar)) product.description = description;
    if (price !== undefined) product.price = price;
    if (discount !== undefined) product.discount = discount;
    if (stock !== undefined) product.stock = stock;

    // ✅ لو المستخدم رفع صور جديدة → نحذف القديمة ونرفع الجديدة
    if (req.files?.images && req.files.images.length > 0) {
        // 🗑️ حذف الصور القديمة من Cloudinary
        for (const img of product.images) {
            if (img.public_id) {
                try {
                    await cloud.uploader.destroy(img.public_id);
                } catch (err) {
                    console.warn("⚠️ فشل حذف صورة قديمة من Cloudinary:", img.public_id);
                }
            }
        }

        // 📤 رفع الصور الجديدة
        const newImages = [];
        for (const file of req.files.images) {
            const uploaded = await cloud.uploader.upload(file.path, { folder: "supermarkets/products" });
            newImages.push({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });
        }
        product.images = newImages;
    }

    await product.save();

    return res.status(200).json({
        message: "✅ تم تحديث المنتج بنجاح",
        data: product
    });
});









export const deleteProducts = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;

    // 🔍 البحث عن المنتج والتأكد أن المستخدم هو المنشئ
    const product = await ProductModelllll.findOne({ _id: id, createdBy: req.user._id });
    if (!product) {
        return next(new Error("المنتج غير موجود أو ليس لديك صلاحية لحذفه", { cause: 404 }));
    }

    // 🗑️ حذف الصور من Cloudinary لو موجودة
    if (product.images && product.images.length > 0) {
        for (const img of product.images) {
            if (img.public_id) {
                try {
                    await cloud.uploader.destroy(img.public_id);
                } catch (err) {
                    console.warn("⚠️ فشل حذف صورة من Cloudinary:", img.public_id);
                }
            }
        }
    }

    // 🗑️ حذف المنتج من قاعدة البيانات
    await ProductModelllll.findByIdAndDelete(id);

    return res.status(200).json({ message: "✅ تم حذف المنتج بنجاح" });
});








// دالة لحساب المسافة بالكيلومتر (صيغة Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const toRad = (value) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // المسافة بالكيلومتر
}

export const getSupermarket = asyncHandelr(async (req, res, next) => {
    const { latitude, longitude, lang } = req.query;

    // ✅ تحقق من وجود إحداثيات
    // if (!latitude || !longitude) {
    //     return next(new Error("الرجاء إدخال latitude و longitude في الاستعلام", { cause: 400 }));
    // }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    // ✅ هات كل السوبر ماركت
    const supermarkets = await SupermarketModel.find().lean();

    if (!supermarkets.length) {
        return res.status(200).json({ message: "لا يوجد سوبر ماركت", data: [] });
    }

    // ✅ localize function
    const localize = (multi, lang) => {
        if (!lang) return multi;
        return (multi && multi[lang]) ? multi[lang] : (multi?.en || multi?.fr || multi?.ar || "");
    };

    // ✅ احسب المسافة لكل سوبر ماركت
    const data = supermarkets.map((sm) => {
        const smLat = sm.pickup?.latitude;
        const smLon = sm.pickup?.longitude;

        let distance = null;
        if (smLat != null && smLon != null) {
            distance = calculateDistance(userLat, userLon, smLat, smLon);
        }

        return {
            _id: sm._id,
            name: localize(sm.name, lang),
            description: localize(sm.description, lang),
            phone: sm.phone,
            pickup: sm.pickup,
            supermarketLocationLink: sm.supermarketLocationLink,
            image: sm.image,
            bannerImages: sm.bannerImages,
            isOpen: sm.isOpen,
            distance: distance !== null ? parseFloat(distance.toFixed(2)) : null, // بالكيلومتر
            createdAt: sm.createdAt,
            updatedAt: sm.updatedAt
        };
    });

    // ✅ رتبهم من الأقرب للأبعد
    data.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));

    return res.status(200).json({ data });
});





export const getSupermarketAdmin = asyncHandelr(async (req, res, next) => {
    const { latitude, longitude, lang } = req.query;

    // ✅ تحقق من وجود إحداثيات
    // if (!latitude || !longitude) {
    //     return next(new Error("الرجاء إدخال latitude و longitude في الاستعلام", { cause: 400 }));
    // }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    // ✅ هات كل السوبر ماركت
    const supermarkets = await SupermarketModel.find().lean();

    if (!supermarkets.length) {
        return res.status(200).json({ message: "لا يوجد سوبر ماركت", data: [] });
    }

    // ✅ localize function
    const localize = (multi, lang) => {
        if (!lang) return multi;
        return (multi && multi[lang]) ? multi[lang] : (multi?.en || multi?.fr || multi?.ar || "");
    };

    // ✅ احسب المسافة لكل سوبر ماركت
    const data = supermarkets.map((sm) => {
        const smLat = sm.pickup?.latitude;
        const smLon = sm.pickup?.longitude;

        let distance = null;
        if (smLat != null && smLon != null) {
            distance = calculateDistance(userLat, userLon, smLat, smLon);
        }

        return {
            _id: sm._id,
            name: localize(sm.name, lang),
            description: localize(sm.description, lang),
            phone: sm.phone,
            // pickup: sm.pickup,
            supermarketLocationLink: sm.supermarketLocationLink,
            image: sm.image,
            // bannerImages: sm.bannerImages,
            isOpen: sm.isOpen,
            distance: distance !== null ? parseFloat(distance.toFixed(2)) : null, // بالكيلومتر
            createdAt: sm.createdAt,
            updatedAt: sm.updatedAt
        };
    });

    // ✅ رتبهم من الأقرب للأبعد
    data.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));

    return res.status(200).json({ data });
});

export const createUserByOwner = asyncHandelr(async (req, res, next) => {
    const { fullName, email, accountType, password } = req.body;
    const ownerId = req.user._id; // الـ Owner داخل بالتوكن

    // ✅ تحقق أن المستخدم الحالي هو Owner
    if (req.user.accountType !== "Owner") {
        return res.status(403).json({
            success: false,
            message: "❌ غير مصرح لك بإنشاء مستخدمين"
        });
    }

    // ✅ تحقق من البيانات الأساسية
    if (!fullName || !email || !accountType) {
        return res.status(400).json({
            success: false,
            message: "❌ يجب إدخال fullName و email و accountType"
        });
    }

    // ✅ تحقق من عدم تكرار البريد
    const checkuser = await dbservice.findOne({
        model: Usermodel,
        filter: { email }
    });

    if (checkuser) {
        return next(new Error("❌ البريد الإلكتروني مستخدم من قبل", { cause: 400 }));
    }

    // ✅ تجهيز كلمة المرور
    let finalPassword = password;
    if (!finalPassword) {
        finalPassword = crypto.randomBytes(4).toString("hex"); // باسورد عشوائي 8 حروف
    }

    // ✅ تشفير كلمة المرور
    const hashpassword = await generatehash({ planText: finalPassword });

    // ✅ إنشاء المستخدم
    const newUser = await dbservice.create({
        model: Usermodel,
        data: {
            fullName,
            email,
            accountType,
            password: hashpassword,
            isConfirmed: true, // 👈 Owner بيفعل المستخدم مباشرة
        }
    });

    return res.status(201).json({
        success: true,
        message: "✅ تم إنشاء المستخدم بنجاح",
        data: {
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            accountType: newUser.accountType,
            isConfirmed: newUser.isConfirmed,
            generatedPassword: password ? undefined : finalPassword // نرجع الباسورد العشوائي فقط لو Owner ما بعتهوش
        }
    });
});



export const getUsersByOwner = asyncHandelr(async (req, res, next) => {
    const ownerId = req.user._id;

    if (req.user.accountType !== "Owner") {
        return res.status(403).json({
            success: false,
            message: "❌ غير مصرح لك بجلب المستخدمين"
        });
    }

    const { accountType } = req.query; // 👈 فلتر من الكويري

    let filter = {
        accountType: { $in: ["Admin", "staff", "manager"] } // ✅ فقط الثلاثة دول
    };

    if (accountType) {
        filter.accountType = accountType; // لو فيه فلتر من الكويري
    }

    // 🔎 رجع بس الحقول المطلوبة
    const users = await Usermodel.find(filter)
        .select("accountType email role fullName");


    return res.status(200).json({
        success: true,
        message: "✅ تم جلب المستخدمين",
        count: users.length,
        data: users
    });
});

export const updateUserByOwner = asyncHandelr(async (req, res, next) => {
    const { id } = req.params; // ID المستخدم اللي هيعدله
    const { fullName, email, accountType, password } = req.body;
    const ownerId = req.user._id;

    // ✅ تحقق أن المستخدم الحالي هو Owner
    if (req.user.accountType !== "Owner") {
        return res.status(403).json({
            success: false,
            message: "❌ غير مصرح لك بتعديل بيانات المستخدمين"
        });
    }

    // ✅ ابحث عن المستخدم المطلوب تعديله
    const user = await Usermodel.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "❌ المستخدم غير موجود"
        });
    }

    // ✅ تحديث الحقول المسموح بها فقط
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (accountType) user.accountType = accountType;

    if (password) {
        // لو فيه باسورد جديد → تشفيره
        const hashpassword = await generatehash({ planText: password });
        user.password = hashpassword;
    }

    await user.save();

    return res.status(200).json({
        success: true,
        message: "✅ تم تعديل بيانات المستخدم بنجاح",
        data: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            accountType: user.accountType
        }
    });
});


export const deleteUserByOwner = asyncHandelr(async (req, res, next) => {
    const { userId } = req.params; // 👈 ID المستخدم المراد حذفه
    const ownerId = req.user._id;  // 👈 الـ Owner داخل بالتوكن

    // ✅ تحقق أن المستخدم الحالي هو Owner
    if (req.user.accountType !== "Owner") {
        return res.status(403).json({
            success: false,
            message: "❌ غير مصرح لك بحذف مستخدمين"
        });
    }

    // ✅ ابحث عن المستخدم
    const user = await dbservice.findOne({
        model: Usermodel,
        filter: { _id: userId }
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "❌ المستخدم غير موجود"
        });
    }

    // ✅ نحذف المستخدم
    await dbservice.deleteOne({
        model: Usermodel,
        filter: { _id: userId }
    });

    return res.status(200).json({
        success: true,
        message: "✅ تم حذف المستخدم بنجاح",
        data: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            accountType: user.accountType
        }
    });
});



export const getSupermarketSections = asyncHandelr(async (req, res, next) => {
    const { id } = req.params; // supermarketId
    const lang = req.query.lang; // optional ?lang=ar

    // ✅ تحقق من وجود السوبر ماركت
    const supermarket = await SupermarketModel.findById(id).lean();
    if (!supermarket) {
        return next(new Error("السوبر ماركت غير موجود", { cause: 404 }));
    }

    // ✅ هات الأقسام المرتبطة بالسوبر ماركت
    const sections = await SectionModel.find({ supermarket: id }).lean();

    // ✅ هات المنتجات المرتبطة بالسوبر ماركت
    const products = await ProductModelllll.find({ supermarket: id }).lean();

    // Helper: localize نص متعدد اللغات
    const localize = (multi, lang) => {
        if (!lang) return multi;
        return (multi && multi[lang]) ? multi[lang] : (multi?.en || multi?.fr || multi?.ar || "");
    };

    // ✅ رتب الاستجابة
    const response = sections.map(section => ({
        _id: section._id,
        name: localize(section.name, lang),
        description: localize(section.description, lang),
        createdAt: section.createdAt,
        updatedAt: section.updatedAt,
        products: products
            .filter(p => p.section.toString() === section._id.toString())
            .map(p => ({
                _id: p._id,
                name: localize(p.name, lang),
                description: localize(p.description, lang),
                images: p.images,
                price: p.price,
                discount: p.discount,
                stock: p.stock,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt
            }))
    }));

    return res.status(200).json({ data: response });
});



import NodeGeocoder from "node-geocoder";
import fetch from "node-fetch";

// ✅ إعداد geocoder
const geocoder = NodeGeocoder({
    provider: "openstreetmap" // تقدر تغير لـ google مع apiKey لو محتاج دقة أعلى
});

// 🧩 دالة ترجع إحداثيات لأي لينك (سواء short أو مباشر)
const getCoordinates = async (link) => {
    try {
        // 1️⃣ لو فيه q=lat,long في الرابط
        const regex = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = link.match(regex);
        if (match) {
            return {
                latitude: parseFloat(match[1]),
                longitude: parseFloat(match[2])
            };
        }

        // 2️⃣ لو الرابط short link (maps.app.goo.gl) → نفكه
        if (link.includes("maps.app.goo.gl")) {
            const response = await fetch(link, { redirect: "follow" });
            const finalUrl = response.url;

            // جرّب regex تاني بعد الفك
            const match2 = finalUrl.match(regex);
            if (match2) {
                return {
                    latitude: parseFloat(match2[1]),
                    longitude: parseFloat(match2[2])
                };
            }

            // 3️⃣ fallback geocode
            const geo = await geocoder.geocode(finalUrl);
            if (geo?.length) {
                return { latitude: geo[0].latitude, longitude: geo[0].longitude };
            }
        } else {
            // 4️⃣ لو لينك عادي → geocode
            const geo = await geocoder.geocode(link);
            if (geo?.length) {
                return { latitude: geo[0].latitude, longitude: geo[0].longitude };
            }
        }
    } catch (err) {
        console.error("❌ خطأ أثناء استخراج الإحداثيات:", err.message);
    }
    return { latitude: null, longitude: null };
};

// export const createOrderSupermarket = async (req, res, next) => {
//     try {
//         const {
//             supermarket,
//             products,
//             customItems,
//             supermarketLocationLink,
//             userLocationLink,
//             addressText,
//             note,
//             contactPhone
//         } = req.body;

//         const userId = req.user._id;

//         // 🧮 حساب السعر
//         let totalPrice = 0;
//         if (products?.length) {
//             for (const item of products) {
//                 const product = await ProductModelllll.findById(item.product);
//                 if (!product) continue;

//                 const priceAfterDiscount =
//                     product.price - (product.price * (product.discount || 0)) / 100;
//                 totalPrice += priceAfterDiscount * (item.quantity || 1);
//             }
//         }

//         // 📍 استخرج الإحداثيات من اللينكات
//         const supermarketCoords = await getCoordinates(supermarketLocationLink);
//         const userCoords = await getCoordinates(userLocationLink);

//         // 🛒 إنشاء الطلب
//         const order = await OrderModellllll.create({
//             user: userId,
//             supermarket,
//             products,
//             customItems,
//             supermarketLocationLink,
//             userLocationLink,
//             supermarketLocationLink2: supermarketCoords,
//             userLocationLink2: userCoords,
//             addressText,
//             note,
//             contactPhone,
//             totalPrice,
//             status: "pending"
//         });

//         // 🚀📌 إشعارات الأونر والمدراء (نفس فكرة المطعم)
//         const supermarketDoc = await SupermarketModel.findById(supermarket)
//             .populate("createdBy", "name fcmToken")
//             .populate("authorizedUsers.user", "name fcmToken");

//         const recipients = [];

//         // صاحب السوبرماركت
//         if (supermarketDoc?.createdBy?.fcmToken) {
//             recipients.push({
//                 user: supermarketDoc.createdBy._id,
//                 fcmToken: supermarketDoc.createdBy.fcmToken,
//             });
//         }

//         // المدراء
//         supermarketDoc?.authorizedUsers?.forEach(authUser => {
//             if (authUser.role === "staff" && authUser.user?.fcmToken) {
//                 recipients.push({
//                     user: authUser.user._id,
//                     fcmToken: authUser.user.fcmToken,
//                 });
//             }
//         });

//         if (!recipients.length) {
//             console.log("⚠️ مفيش حد ليه توكن يوصله إشعار");
//         } else {
//             for (const recipient of recipients) {
//                 try {
//                     await admin.messaging().send({
//                         notification: {
//                             title: "🛒 طلب جديد من السوبرماركت",
//                             body: "تم استلام طلب جديد"
//                         },
//                         data: {
//                             orderId: order._id.toString(),
//                             supermarketId: supermarketDoc._id.toString(),
//                             createdAt: order.createdAt.toISOString()
//                         },
//                         token: recipient.fcmToken,
//                     });

//                     await NotificationModell.create({
//                         supermarket: supermarketDoc._id,
//                         order: order._id,
//                         title: "🛒 طلب جديد",
//                         body: "تم استلام طلب جديد",
//                         deviceToken: recipient.fcmToken, // ✅ دلوقتي مطابق
//                     });


//                 } catch (error) {
//                     console.error("❌ فشل إرسال الإشعار:", error);
//                 }
//             }
//         }

//         return res.status(201).json({
//             success: true,
//             message: "✅ تم إنشاء الطلب بنجاح",
//             data: order
//         });
//     } catch (error) {
//         next(error);
//     }
// };


// 📌 API: جلب إشعارات السوبرماركت
export const getSupermarketNotifications = async (req, res, next) => {
    try {
        const { supermarketId } = req.params;

        if (!supermarketId) {
            return next(new Error("يجب إدخال معرف السوبرماركت", { cause: 400 }));
        }

        // ✅ جلب الإشعارات المرتبطة بالسوبرماركت
        const notifications = await NotificationModell.find({ supermarket: supermarketId })
            .populate("order", "status totalPrice") // لو عايز تجيب بيانات الأوردر
            .sort({ createdAt: -1 }); // أحدث إشعارات أولاً

        return res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });

    } catch (error) {
        next(error);
    }
};





// export const updateOrderStatusSupermarket = async (req, res, next) => {
//     try {
//         const { orderId } = req.params;
//         let { status, AccountType, Invoice } = req.body;

//         // ✅ تحقق من إرسال الحالة
//         if (!status) {
//             return next(new Error("⚠️ الحالة مطلوبة", { cause: 400 }));
//         }

//         // ✅ الحالات المسموح بيها
//         const allowedStatuses = ["pending", "accepted", "rejected", "in-progress", "delivered", "cancelled", "deleted"];
//         if (!allowedStatuses.includes(status)) {
//             return next(new Error("⚠️ الحالة غير صحيحة", { cause: 400 }));
//         }

//         // ✅ تجهيز صورة الفاتورة
//         let InvoicePicture = {};
//         if (req.files?.image) {
//             const uploaded = await cloud.uploader.upload(req.files.image[0].path, {
//                 folder: "supermarkets/invoices"
//             });
//             InvoicePicture = {
//                 secure_url: uploaded.secure_url,
//                 public_id: uploaded.public_id
//             };
//         }

//         // ✅ تحديث الطلب
//         const order = await OrderModellllll.findByIdAndUpdate(
//             orderId,
//             {
//                 status,
//                 AccountType: AccountType || "",
//                 Invoice: Invoice || "notPaid",
//                 ...(Object.keys(InvoicePicture).length > 0 && { InvoicePicture })
//             },
//             { new: true }
//         )
//             .populate("user", "fullName phone email")
//             .populate("products.product", "name price images");

//         if (!order) {
//             return next(new Error("❌ لم يتم العثور على الطلب", { cause: 404 }));
//         }

//         return res.status(200).json({
//             success: true,
//             message: `✅ تم تحديث حالة الطلب إلى ${status}`,
//             data: order
//         });

//     } catch (error) {
//         next(error);
//     }
// };



// export const updateOrderStatusSupermarket = async (req, res, next) => {
//     try {
//         const { orderId } = req.params;
//         let { status, AccountType, Invoice } = req.body;

//         // ✅ تحقق من إرسال الحالة
//         if (!status) {
//             return next(new Error("⚠️ الحالة مطلوبة", { cause: 400 }));
//         }

//         // ✅ الحالات المسموح بيها
//         const allowedStatuses = ["pending", "accepted", "rejected", "in-progress", "delivered", "cancelled", "deleted"];
//         if (!allowedStatuses.includes(status)) {
//             return next(new Error("⚠️ الحالة غير صحيحة", { cause: 400 }));
//         }

//         // ✅ جلب الطلب الحالي
//         const existingOrder = await OrderModellllll.findById(orderId);
//         if (!existingOrder) {
//             return next(new Error("❌ لم يتم العثور على الطلب", { cause: 404 }));
//         }

//         // ✅ منع التعديل بعد الموافقة أو الحذف
//         if (["accepted", "deleted"].includes(existingOrder.status)) {
//             return next(new Error("⚠️ لا يمكن تعديل الطلب بعد الموافقة أو إذا كان محذوفًا", { cause: 400 }));
//         }

//         // ✅ تجهيز صورة الفاتورة
//         let InvoicePicture = {};
//         if (req.files?.image) {
//             const uploaded = await cloud.uploader.upload(req.files.image[0].path, {
//                 folder: "supermarkets/invoices"
//             });
//             InvoicePicture = {
//                 secure_url: uploaded.secure_url,
//                 public_id: uploaded.public_id
//             };
//         }

//         // ✅ تحديث الطلب
//         const order = await OrderModellllll.findByIdAndUpdate(
//             orderId,
//             {
//                 status,
//                 AccountType: AccountType || "",
//                 Invoice: Invoice || "notPaid",
//                 ...(Object.keys(InvoicePicture).length > 0 && { InvoicePicture })
//             },
//             { new: true }
//         )
//             .populate("user", "fullName phone email")
//             .populate("products.product", "name price images");

//         return res.status(200).json({
//             success: true,
//             message: `✅ تم تحديث حالة الطلب إلى ${status}`,
//             data: order
//         });

//     } catch (error) {
//         next(error);
//     }
// };











// export const getSupermarketOrders = async (req, res, next) => {
//     try {
//         const { supermarketId } = req.params;
//         const lang = req.query.lang || "ar"; // 🟢 اللغة الافتراضية "ar"

//         if (!supermarketId) {
//             return next(new Error("⚠️ رقم السوبرماركت مطلوب", { cause: 400 }));
//         }

//         // ✅ هات الطلبات الخاصة بالسوبرماركت
//         const orders = await OrderModellllll.find({ supermarket: supermarketId })
//             .sort({ createdAt: -1 })
//             .populate("user", "fullName email phone")
//             .populate("products.product", "name price discount images");

//         if (!orders.length) {
//             return res.status(200).json({
//                 success: true,
//                 message: "ℹ️ لا توجد طلبات لهذا السوبرماركت حالياً",
//                 count: 0,
//                 data: []
//             });
//         }

//         // 🟢 فلترة النصوص + إعادة هيكلة المنتجات (Flat structure)
//         const formattedOrders = orders.map(order => {
//             const formattedProducts = order.products.map(p => {
//                 if (p.product) {
//                     return {
//                         _id: p.product._id,
//                         name: p.product.name?.[lang] || p.product.name?.ar || "",
//                         images: p.product.images || [],
//                         price: p.product.price,
//                         discount: p.product.discount,
//                         quantity: p.quantity
//                     };
//                 }
//                 return null;
//             }).filter(Boolean);

//             return {
//                 _id: order._id,
//                 user: order.user ? {
//                     _id: order.user._id,
//                     fullName: order.user.fullName,
//                     phone: order.user.phone
//                 } : null,
//                 supermarket: order.supermarket,
//                 products: formattedProducts,
//                 customItems: order.customItems,
//                 supermarketLocationLink: order.supermarketLocationLink,
//                 userLocationLink: order.userLocationLink,
//                 addressText: order.addressText,
//                 note: order.note,
//                 contactPhone: order.contactPhone,
//                 status: order.status,
//                 totalPrice: order.totalPrice,
//                 createdAt: order.createdAt,
//                 updatedAt: order.updatedAt
//             };
//         });

//         return res.status(200).json({
//             success: true,
//             message: "✅ تم جلب الطلبات الخاصة بالسوبرماركت بنجاح",
//             count: formattedOrders.length,
//             data: formattedOrders
//         });

//     } catch (error) {
//         next(error);
//     }
// };


export const updateOrderStatusSupermarket = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        let { status, AccountType, Invoice } = req.body;

        // ✅ تحقق من إرسال الحالة
        if (!status) {
            return next(new Error("⚠️ الحالة مطلوبة", { cause: 400 }));
        }

        // ✅ الحالات المسموح بيها
        const allowedStatuses = [
            "pending",
            "accepted",
            "rejected",
            "in-progress",
            "delivered",
            "cancelled",
            "deleted"
        ];
        if (!allowedStatuses.includes(status)) {
            return next(new Error("⚠️ الحالة غير صحيحة", { cause: 400 }));
        }

        // ✅ جلب الطلب الحالي مع بيانات العميل
        const existingOrder = await OrderModellllll.findById(orderId)
            .populate("user", "fullName fcmToken")
            .populate("supermarket", "name");

        if (!existingOrder) {
            return next(new Error("❌ لم يتم العثور على الطلب", { cause: 404 }));
        }

        // ✅ منع التعديل بعد الموافقة أو الحذف
        if (["accepted", "deleted"].includes(existingOrder.status)) {
            return next(
                new Error("⚠️ لا يمكن تعديل الطلب بعد الموافقة أو إذا كان محذوفًا", { cause: 400 })
            );
        }

        // ✅ تجهيز صورة الفاتورة
        let InvoicePicture = {};
        if (req.files?.image) {
            const uploaded = await cloud.uploader.upload(req.files.image[0].path, {
                folder: "supermarkets/invoices"
            });
            InvoicePicture = {
                secure_url: uploaded.secure_url,
                public_id: uploaded.public_id
            };
        }

        // ✅ تحديث الطلب
        const order = await OrderModellllll.findByIdAndUpdate(
            orderId,
            {
                status,
                AccountType: AccountType || "",
                Invoice: Invoice || "notPaid",
                ...(Object.keys(InvoicePicture).length > 0 && { InvoicePicture })
            },
            { new: true }
        )
            .populate("user", "fullName phone email")
            .populate("products.product", "name price images");

        // 🔔 إرسال إشعار للعميل إذا تم قبول الطلب
        if (status === "accepted" && existingOrder.user?.fcmToken) {
            try {
                await admin.messaging().send({
                    notification: {
                        title: "🛒 تم قبول طلبك!",
                        body: `السوبرماركت وافق على طلبك وجاري التجهيز 📦`,
                    },
                    data: {
                        orderId: order._id.toString(),
                        supermarketId: existingOrder.supermarket?._id?.toString() || "",
                        status: "accepted",
                    },
                    token: existingOrder.user.fcmToken,
                });

                // 🗂️ حفظ الإشعار في قاعدة البيانات
                await NotificationModell.create({
                    user: existingOrder.user._id,
                    order: order._id,
                    title: "🛒 تم قبول طلبك",
                    body: `السوبرماركت وافق على طلبك وجاري التجهيز`,
                    fcmToken: existingOrder.user.fcmToken,
                });
            } catch (error) {
                console.error("❌ فشل إرسال إشعار للعميل:", error);
            }
        }

        return res.status(200).json({
            success: true,
            message: `✅ تم تحديث حالة الطلب إلى ${status}`,
            data: order
        });

    } catch (error) {
        next(error);
    }
};












export const getSupermarketOrders = async (req, res, next) => {
    try {
        const { supermarketId } = req.params;
        const lang = req.query.lang || "ar"; // 🟢 اللغة الافتراضية "ar"

        if (!supermarketId) {
            return next(new Error("⚠️ رقم السوبرماركت مطلوب", { cause: 400 }));
        }

        // ✅ هات الطلبات الخاصة بالسوبرماركت مع استبعاد deleted و created
        const orders = await OrderModellllll.find({
            supermarket: supermarketId,
            status: { $nin: ["deleted", "created"] } // 🔥 استبعاد الحالتين
        })
            .sort({ createdAt: -1 })
            .populate("user", "fullName email phone")
            .populate("products.product", "name price discount images");

        if (!orders.length) {
            return res.status(200).json({
                success: true,
                message: "ℹ️ لا توجد طلبات لهذا السوبرماركت حالياً",
                count: 0,
                data: []
            });
        }

        // 🟢 فلترة النصوص + إعادة هيكلة المنتجات (Flat structure)
        const formattedOrders = orders.map(order => {
            const formattedProducts = order.products.map(p => {
                if (p.product) {
                    return {
                        _id: p.product._id,
                        name: p.product.name?.[lang] || p.product.name?.ar || "",
                        images: p.product.images || [],
                        price: p.product.price,
                        discount: p.product.discount,
                        quantity: p.quantity
                    };
                }
                return null;
            }).filter(Boolean);

            return {
                _id: order._id,
                user: order.user ? {
                    _id: order.user._id,
                    fullName: order.user.fullName,
                    phone: order.user.phone
                } : null,
                supermarket: order.supermarket,
                products: formattedProducts,
                customItems: order.customItems,
                supermarketLocationLink: order.supermarketLocationLink,
                userLocationLink: order.userLocationLink,
                addressText: order.addressText,
                note: order.note,
                contactPhone: order.contactPhone,
                status: order.status,
                finalPrice: order.finalPrice,
                deliveryPrice: order.deliveryPrice,
                InvoicePicture: order.InvoicePicture,
                AccountType: order.AccountType,
                Invoice: order.Invoice,
                totalPrice: order.totalPrice,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });

        return res.status(200).json({
            success: true,
            message: "✅ تم جلب الطلبات الخاصة بالسوبرماركت بنجاح",
            count: formattedOrders.length,
            data: formattedOrders
        });

    } catch (error) {
        next(error);
    }
};
 



// export const createOrder = asyncHandelr(async (req, res, next) => {
//     let {
//         restaurantId,
//         contactNumber,
//         // websiteLink,
//         additionalNotes,
//         addressText,
//         products,
//         restaurantLocationLink, // ✅ الإضافة
//         userLocationLink        // ✅ الإضافة
//     } = req.body;

//     if (!restaurantId || !contactNumber || !products?.length) {
//         return next(new Error("جميع الحقول الأساسية مطلوبة (المطعم، رقم التواصل، المنتجات)", { cause: 400 }));
//     }

//     const restaurant = await RestaurantModell.findById(restaurantId)
//         .populate("createdBy", "name fcmToken")
//         .populate("authorizedUsers.user", "name fcmToken");

//     if (!restaurant) {
//         return next(new Error("المطعم غير موجود", { cause: 404 }));
//     }

//     // ✅ استخرج إحداثيات المطعم والعميل
//     const restaurantCoords = await getCoordinates(restaurantLocationLink);
//     const userCoords = await getCoordinates(userLocationLink);

//     // 🛠 إنشاء الأوردر
//     const order = await OrderModel.create({
//         restaurant: restaurant._id,
//         contactNumber: contactNumber || restaurant.phone,
//         // websiteLink: websiteLink || restaurant.websiteLink,
//         additionalNotes,
//         products,
//         addressText,
//         createdBy: req.user._id,

//         // ✅ إضافة المواقع
//         restaurantLocation: {
//             link: restaurantLocationLink,
//             latitude: restaurantCoords.latitude,
//             longitude: restaurantCoords.longitude
//         },
//         userLocation: {
//             link: userLocationLink,
//             latitude: userCoords.latitude,
//             longitude: userCoords.longitude
//         }
//     });

//     // 📌 نفس كود الإشعارات اللي عندك بدون تغيير
//     const recipients = [];
//     if (restaurant.createdBy?.fcmToken) {
//         recipients.push({
//             user: restaurant.createdBy._id,
//             fcmToken: restaurant.createdBy.fcmToken,
//         });
//     }
//     restaurant.authorizedUsers.forEach(authUser => {
//         if (authUser.role === "manager" && authUser.user?.fcmToken) {
//             recipients.push({
//                 user: authUser.user._id,
//                 fcmToken: authUser.user.fcmToken,
//             });
//         }
//     });

//     if (!recipients.length) {
//         console.log("⚠️ مفيش حد ليه توكن يوصله إشعار");
//     } else {
//         for (const recipient of recipients) {
//             try {
//                 await admin.messaging().send({
//                     notification: {
//                         title: "🚀 طلب جديد",
//                         body: "تم استلام طلب جديد"
//                     },
//                     data: {
//                         orderId: order._id.toString(),
//                         restaurantId: restaurant._id.toString(),
//                         createdAt: order.createdAt.toISOString()
//                     },
//                     token: recipient.fcmToken,
//                 });

//                 await NotificationModell.create({
//                     restaurant: restaurant._id,
//                     order: order._id,
//                     title: "🚀 طلب جديد",
//                     body: "تم استلام طلب جديد",
//                     fcmToken: recipient.fcmToken,
//                 });
//             } catch (error) {
//                 console.error("❌ فشل إرسال الإشعار:", error);
//             }
//         }
//     }

//     res.status(201).json({
//         message: "تم إنشاء الأوردر بنجاح",
//         data: order
//     });
// });





import haversine from "haversine-distance"; // npm i haversine-distance
import { ServiceModel } from "../../../DB/models/serviceSchema.js";
import { sendemail } from "../../../utlis/email/sendemail.js";
import { vervicaionemailtemplet } from "../../../utlis/temblete/vervication.email.js";
import { PropertyBookingModel } from "../../../DB/models/propertyBookingSchema.js";

export const getAcceptedOrders = asyncHandelr(async (req, res, next) => {
    try {
        const { latitude, longitude, lang = "ar" } = req.query;

        if (!latitude || !longitude) {
            return next(new Error("يرجى إدخال الإحداثيات (latitude, longitude)", { cause: 400 }));
        }

        const userCoords = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        };

        // 🛠 هات الطلبات من المطاعم
        const restaurantOrders = await OrderModel.find({ status: "accepted" })
            .populate("restaurant", "name")
            .populate("createdBy", "name email");

        // 🛠 هات الطلبات من السوبرماركت + populate للـ products
        const supermarketOrders = await OrderModellllll.find({ status: "accepted" })
            .populate("supermarket", "name")
            .populate("user", "name email")
            .populate("products.product", "name price");

        // 📌 دمج الاثنين مع حساب المسافات
        const allOrders = [
            // ✅ مطاعم
            ...restaurantOrders.map(order => {
                const o = order.toObject();

                const distToClient = haversine(userCoords, {
                    latitude: o.userLocation.latitude,
                    longitude: o.userLocation.longitude
                }) / 1000;

                const distToRestaurant = haversine(userCoords, {
                    latitude: o.restaurantLocation.latitude,
                    longitude: o.restaurantLocation.longitude
                }) / 1000;

                return {
                    ...o,
                    type: "restaurant",
                    products: (o.products || []).map(p => ({
                        name: typeof p.name === "object" ? (p.name[lang] || p.name["ar"]) : p.name,
                        price: p.price,
                        quantity: p.quantity
                    })),
                    distanceToClient: distToClient.toFixed(2) + " km",
                    distanceToRestaurant: distToRestaurant.toFixed(2) + " km"
                };
            }),

            // ✅ سوبرماركت
            ...supermarketOrders.map(order => {
                const o = order.toObject();

                const distToClient = haversine(userCoords, {
                    latitude: o.userLocationLink2.latitude,
                    longitude: o.userLocationLink2.longitude
                }) / 1000;

                const distToSupermarket = haversine(userCoords, {
                    latitude: o.supermarketLocationLink2.latitude,
                    longitude: o.supermarketLocationLink2.longitude
                }) / 1000;

                // 📌 خلي الـ products فيها name + price + quantity
                const formattedProducts = (o.products || []).map(p => ({
                    name: typeof p.product?.name === "object"
                        ? (p.product?.name[lang] || p.product?.name["ar"])
                        : p.product?.name || "منتج غير معروف",
                    price: p.product?.price || 0,
                    quantity: p.quantity
                }));

                return {
                    ...o,
                    type: "supermarket",
                    supermarket: {
                        ...o.supermarket,
                        name: typeof o.supermarket?.name === "object"
                            ? (o.supermarket?.name[lang] || o.supermarket?.name["ar"])
                            : o.supermarket?.name
                    },
                    products: formattedProducts,
                    customItems: o.customItems || [],
                    distanceToClient: distToClient.toFixed(2) + " km",
                    distanceToSupermarket: distToSupermarket.toFixed(2) + " km"
                };
            })
        ];

        // 📌 ترتيب الطلبات حسب أقرب عميل
        allOrders.sort((a, b) => {
            return parseFloat(a.distanceToClient) - parseFloat(b.distanceToClient);
        });

        res.status(200).json({
            success: true,
            message: "✅ تم جلب الطلبات المقبولة مع المسافات",
            count: allOrders.length,
            data: allOrders
        });

    } catch (error) {
        next(error);
    }
});



export const getUserOrders = async (req, res, next) => {
    try {
        const { userId, lang = "ar" } = req.query;

        if (!userId) {
            return next(new Error("⚠️ يرجى إرسال userId", { cause: 400 }));
        }

        // ✅ طلبات المطاعم
        const restaurantOrders = await OrderModel.find({ createdBy: userId })
            .populate("restaurant", "name")
            .populate("assignedDriver", "fullName phone email profiePicture") // جلب بيانات الدليفري إن وجد
            .populate("createdBy", "email");

        // ✅ طلبات السوبرماركت
        const supermarketOrders = await OrderModellllll.find({ user: userId })
            .populate("supermarket", "name")
            .populate("assignedDriver", "fullName phone email profiePicture")
            .populate("user", "email")
            .populate("products.product", "name price");

        // ✅ تجهيز الصيغة المطلوبة
        const allOrders = [
            ...supermarketOrders.map(order => ({
                _id: order._id,
                type: "supermarket",
                supermarket: {
                    _id: order.supermarket?._id,
                    name: typeof order.supermarket?.name === "object"
                        ? {
                            en: order.supermarket?.name.en || "",
                            ar: order.supermarket?.name.ar || ""
                        }
                        : { en: order.supermarket?.name || "", ar: order.supermarket?.name || "" }
                },
                user: {
                    _id: order.user?._id,
                    email: order.user?.email
                },
                products: (order.products || []).map(p => ({
                    name: typeof p.product?.name === "object"
                        ? (p.product?.name[lang] || p.product?.name["ar"])
                        : p.product?.name || "منتج غير معروف",
                    price: p.product?.price || 0,
                    quantity: p.quantity
                })),
                supermarketLocation: {
                    link: order.supermarketLocationLink,
                    latitude: order.supermarketLocationLink2?.latitude,
                    longitude: order.supermarketLocationLink2?.longitude
                },
                userLocation: {
                    link: order.userLocationLink,
                    latitude: order.userLocationLink2?.latitude,
                    longitude: order.userLocationLink2?.longitude
                },
                addressText: order.addressText,
                totalPrice: Number(order.totalPrice),
                deliveryPrice: Number(order.deliveryPrice),
                finalPrice: Number(order.finalPrice),
                contactPhone: order.contactPhone,
                status: order.status,
                invoice: order.Invoice || "notPaid",
                driver:
                    order.status === "on_the_way" || order.status === "delivered"
                        ? order.assignedDriver
                            ? {
                                _id: order.assignedDriver._id,
                                fullName: order.assignedDriver.fullName,
                                phone: order.assignedDriver.phone,
                                email: order.assignedDriver.email,
                                profiePicture: order.assignedDriver.profiePicture
                            }
                            : null
                        : null,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            })),

            ...restaurantOrders.map(order => ({
                _id: order._id,
                type: "restaurant",
                restaurant: {
                    _id: order.restaurant?._id,
                    name: order.restaurant?.name
                },
                products: (order.products || []).map(p => ({
                    name: typeof p.name === "object"
                        ? (p.name[lang] || p.name["ar"])
                        : p.name,
                    price: p.price,
                    quantity: p.quantity
                })),
                contactNumber: order.contactNumber,
                additionalNotes: order.additionalNotes,
                addressText: order.addressText,
                restaurantLocation: {
                    link: order.restaurantLocation?.link,
                    latitude: order.restaurantLocation?.latitude,
                    longitude: order.restaurantLocation?.longitude
                },
                userLocation: {
                    link: order.userLocation?.link,
                    latitude: order.userLocation?.latitude,
                    longitude: order.userLocation?.longitude
                },
                totalPrice: Number(order.totalPrice),
                deliveryPrice: Number(order.deliveryPrice),
                finalPrice: Number(order.finalPrice),
                status: order.status,
                invoice: order.Invoice || "notPaid",
                driver:
                    order.status === "on_the_way" || order.status === "delivered"
                        ? order.assignedDriver
                            ? {
                                _id: order.assignedDriver._id,
                                fullName: order.assignedDriver.fullName,
                                phone: order.assignedDriver.phone,
                                email: order.assignedDriver.email,
                                profiePicture: order.assignedDriver.profiePicture
                            }
                            : null
                        : null,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            }))
        ];

        // ✅ ترتيب الأحدث أولاً
        allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // ✅ النتيجة النهائية
        res.status(200).json({
            success: true,
            message: "✅ تم جلب جميع الطلبات الخاصة بالمستخدم",
            count: allOrders.length,
            data: allOrders
        });

    } catch (error) {
        next(error);
    }
};


// export const getDriverOrdersStats = async (req, res, next) => {
//     try {
//         const { driverId } = req.params;

//         if (!driverId) {
//             return next(new Error("⚠️ يرجى إرسال driverId", { cause: 400 }));
//         }

//         // ✅ جلب طلبات المطاعم
//         const restaurantOrders = await OrderModel.find({ assignedDriver: driverId })
//             .populate("restaurant", "name")
//             .populate("createdBy", "fullName email phone")
//             .lean();

//         // ✅ جلب طلبات السوبرماركت
//         const supermarketOrders = await OrderModellllll.find({ assignedDriver: driverId })
//             .populate("supermarket", "name")
//             .populate("user", "fullName email phone")
//             .populate("products.product", "name price")
//             .lean();

//         // ✅ تجهيز صيغة موحدة للنتائج
//         const formattedRestaurantOrders = restaurantOrders.map(order => ({
//             _id: order._id,
//             type: "restaurant",
//             restaurant: {
//                 _id: order.restaurant?._id,
//                 name: order.restaurant?.name || "مطعم غير معروف"
//             },
//             user: {
//                 _id: order.createdBy?._id,
//                 fullName: order.createdBy?.fullName,
//                 email: order.createdBy?.email,
//                 phone: order.createdBy?.phone
//             },
//             products: order.products.map(p => ({
//                 name: p.name,
//                 price: p.price,
//                 quantity: p.quantity
//             })),
//             addressText: order.addressText,
//             totalPrice: Number(order.totalPrice),
//             deliveryPrice: Number(order.deliveryPrice || 0),
//             finalPrice: Number(order.finalPrice || 0),
//             status: order.status,
//             Invoice: order.Invoice || "notPaid",
//             createdAt: order.createdAt,
//             updatedAt: order.updatedAt
//         }));

//         const formattedSupermarketOrders = supermarketOrders.map(order => ({
//             _id: order._id,
//             type: "supermarket",
//             supermarket: {
//                 _id: order.supermarket?._id,
//                 name: order.supermarket?.name || "سوبرماركت غير معروف"
//             },
//             user: {
//                 _id: order.user?._id,
//                 fullName: order.user?.fullName,
//                 email: order.user?.email,
//                 phone: order.user?.phone
//             },
//             products: (order.products || []).map(p => ({
//                 name: p.product?.name || "منتج غير معروف",
//                 price: p.product?.price || 0,
//                 quantity: p.quantity
//             })),
//             addressText: order.addressText,
//             totalPrice: Number(order.totalPrice || 0),
//             deliveryPrice: Number(order.deliveryPrice || 0),
//             finalPrice: Number(order.finalPrice || 0),
//             status: order.status,
//             Invoice: order.Invoice || "notPaid",
//             createdAt: order.createdAt,
//             updatedAt: order.updatedAt
//         }));

//         // ✅ دمج وترتيب النتائج حسب الأحدث
//         const allOrders = [...formattedRestaurantOrders, ...formattedSupermarketOrders]
//             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//         // ✅ إحصائيات سريعة (اختياري)
//         const acceptedCount = allOrders.filter(o => o.status === "accepted").length;
//         const deliveredCount = allOrders.filter(o => o.status === "delivered").length;
//         const cancelledCount = allOrders.filter(o => o.status === "cancelled").length;
//         const totalEarnings = allOrders.reduce((sum, o) => sum + (o.finalPrice || o.totalPrice || 0), 0);

//         // ✅ النتيجة النهائية
//         return res.status(200).json({
//             success: true,
//             message: "✅ تم جلب جميع الطلبات الخاصة بالدليفري بنجاح",
//             stats: {
//                 acceptedCount,
//                 deliveredCount,
//                 cancelledCount,
//                 totalEarnings,
//                 totalOrders: allOrders.length
//             },
//             data: allOrders
//         });

//     } catch (error) {
//         next(error);
//     }
// };



export const getDriverOrdersStats = async (req, res, next) => {
    try {
        const { driverId } = req.params;

        if (!driverId) {
            return next(new Error("⚠️ يرجى إرسال driverId", { cause: 400 }));
        }

        // ✅ جلب طلبات المطاعم
        const restaurantOrders = await OrderModel.find({ assignedDriver: driverId })
            .populate("restaurant", "name")
            .populate("createdBy", "fullName email phone")
            .lean();

        // ✅ جلب طلبات السوبرماركت
        const supermarketOrders = await OrderModellllll.find({ assignedDriver: driverId })
            .populate("supermarket", "name")
            .populate("user", "fullName email phone")
            .populate("products.product", "name price")
            .lean();

        // ✅ تجهيز صيغة موحدة للنتائج
        const formattedRestaurantOrders = restaurantOrders.map(order => ({
            _id: order._id,
            type: "restaurant",
            restaurant: {
                _id: order.restaurant?._id,
                name: order.restaurant?.name || "مطعم غير معروف"
            },
            user: {
                _id: order.createdBy?._id,
                fullName: order.createdBy?.fullName,
                email: order.createdBy?.email,
                phone: order.createdBy?.phone
            },
            products: order.products.map(p => ({
                name: p.name,
                price: p.price,
                quantity: p.quantity
            })),
            addressText: order.addressText,
            totalPrice: Number(order.totalPrice),
            deliveryPrice: Number(order.deliveryPrice || 0),
            finalPrice: Number(order.finalPrice || 0),
            status: order.status,
            Invoice: order.Invoice || "notPaid",
            createdAt: order.createdAt, // ✅ التاريخ
            updatedAt: order.updatedAt  // ✅ الوقت
        }));

        const formattedSupermarketOrders = supermarketOrders.map(order => ({
            _id: order._id,
            type: "supermarket",
            supermarket: {
                _id: order.supermarket?._id,
                name: order.supermarket?.name || "سوبرماركت غير معروف"
            },
            user: {
                _id: order.user?._id,
                fullName: order.user?.fullName,
                email: order.user?.email,
                phone: order.user?.phone
            },
            products: (order.products || []).map(p => ({
                name: p.product?.name || "منتج غير معروف",
                price: p.product?.price || 0,
                quantity: p.quantity
            })),
            addressText: order.addressText,
            totalPrice: Number(order.totalPrice || 0),
            deliveryPrice: Number(order.deliveryPrice || 0),
            finalPrice: Number(order.finalPrice || 0),
            status: order.status,
            Invoice: order.Invoice || "notPaid",
            createdAt: order.createdAt, // ✅ التاريخ
            updatedAt: order.updatedAt  // ✅ الوقت
        }));

        // ✅ دمج وترتيب النتائج حسب الأحدث
        const allOrders = [...formattedRestaurantOrders, ...formattedSupermarketOrders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // ✅ إحصائيات
        const acceptedCount = allOrders.filter(o => o.status === "accepted").length;
        const deliveredCount = allOrders.filter(o => o.status === "delivered").length;
        const cancelledCount = allOrders.filter(o => o.status === "cancelled").length;
        const totalEarnings = allOrders.reduce((sum, o) => sum + (o.finalPrice || o.totalPrice || 0), 0);

        // ✅ النتيجة النهائية
        return res.status(200).json({
            success: true,
            message: "✅ تم جلب جميع الطلبات الخاصة بالدليفري بنجاح",
            stats: {
                acceptedCount,
                deliveredCount,
                cancelledCount,
                totalEarnings,
                totalOrders: allOrders.length
            },
            data: allOrders // 👈 تحتوي الآن على createdAt و updatedAt
        });

    } catch (error) {
        next(error);
    }
};

















export const getDeliveredOrdersByDriver = asyncHandelr(async (req, res, next) => {
    try {
        const { driverId, lang = "ar" } = req.query;

        if (!driverId) {
            return next(new Error("❌ لازم تبعت driverId", { cause: 400 }));
        }

        // 🛠 هات الطلبات من المطاعم
        const restaurantOrders = await OrderModel.find({
            status: "delivered",
            assignedDriver: driverId
        })
            .populate("restaurant", "name")
            .populate("createdBy", "name email");

        // 🛠 هات الطلبات من السوبرماركت
        const supermarketOrders = await OrderModellllll.find({
            status: "delivered",
            assignedDriver: driverId
        })
            .populate("supermarket", "name")
            .populate("user", "name email")
            .populate("products.product", "name price");

        // 📌 دمج الاثنين
        const allOrders = [
            // ✅ مطاعم
            ...restaurantOrders.map(order => {
                const o = order.toObject();
                return {
                    ...o,
                    type: "restaurant",
                    products: (o.products || []).map(p => ({
                        name: typeof p.name === "object" ? (p.name[lang] || p.name["ar"]) : p.name,
                        price: p.price,
                        quantity: p.quantity
                    }))
                };
            }),

            // ✅ سوبرماركت
            ...supermarketOrders.map(order => {
                const o = order.toObject();

                const formattedProducts = (o.products || []).map(p => ({
                    name: typeof p.product?.name === "object"
                        ? (p.product?.name[lang] || p.product?.name["ar"])
                        : p.product?.name || "منتج غير معروف",
                    price: p.product?.price || 0,
                    quantity: p.quantity
                }));

                return {
                    ...o,
                    type: "supermarket",
                    supermarket: {
                        ...o.supermarket,
                        name: typeof o.supermarket?.name === "object"
                            ? (o.supermarket?.name[lang] || o.supermarket?.name["ar"])
                            : o.supermarket?.name
                    },
                    products: formattedProducts,
                    customItems: o.customItems || []
                };
            })
        ];

        res.status(200).json({
            success: true,
            message: "✅ تم جلب الطلبات التي تم تسليمها لهذا السائق",
            count: allOrders.length,
            data: allOrders
        });

    } catch (error) {
        next(error);
    }
});





export const uploadImages = asyncHandelr(async (req, res, next) => {
    const { title } = req.body;
    const userId = req.user._id;

    if (!req.files || req.files.length === 0) {
        return next(new Error("❌ يجب رفع صورة واحدة على الأقل", { cause: 400 }));
    }

    // ⬆️ رفع كل الصور إلى Cloudinary
    const uploadedImages = [];
    for (const file of req.files) {
        const result = await cloud.uploader.upload(file.path, {
            resource_type: "image",
            folder: "uploads/multi",
        });
        uploadedImages.push({
            url: result.secure_url,
            public_id: result.public_id,
        });
        fs.unlinkSync(file.path); // حذف الصورة المحلية بعد الرفع
    }

    // 💾 حفظ البيانات في قاعدة البيانات
    const newImages = await ImageModel.create({
        userId,
        title,
        images: uploadedImages,
    });

    res.status(201).json({
        success: true,
        message: "✅ تم رفع الصور بنجاح",
        data: newImages,
    });
});



// ✅ إنشاء الطلب
export const createOrder = asyncHandelr(async (req, res, next) => {
    let {
        restaurantId,
        contactNumber,
        additionalNotes,
        addressText,
        products,
        restaurantLocationLink,
        userLocationLink,
        totalPrice // 📌 السعر الأساسي اللي العميل دخله
    } = req.body;

    if (!restaurantId || !contactNumber || !products?.length || !totalPrice) {
        return next(new Error("جميع الحقول الأساسية مطلوبة (المطعم، رقم التواصل، المنتجات، السعر)", { cause: 400 }));
    }

    const restaurant = await RestaurantModell.findById(restaurantId)
        .populate("createdBy", "name fcmToken")
        .populate("authorizedUsers.user", "name fcmToken");

    if (!restaurant) {
        return next(new Error("المطعم غير موجود", { cause: 404 }));
    }

    // ✅ استخرج الإحداثيات
    const restaurantCoords = await getCoordinates(restaurantLocationLink);
    const userCoords = await getCoordinates(userLocationLink);

    // ✅ حساب المسافة بالكيلومتر
    const distanceMeters = haversine(
        { lat: userCoords.latitude, lon: userCoords.longitude },
        { lat: restaurantCoords.latitude, lon: restaurantCoords.longitude }
    );
    const distanceKm = distanceMeters / 1000;

    // ✅ حساب سعر التوصيل
    const deliveryPrice = Math.ceil(distanceKm * 5); // تقريب للأعلى

    // ✅ المجموع الكلي
    const finalPrice = Number(totalPrice) + deliveryPrice;

    // 🛠 إنشاء الأوردر مع الأسعار
    const order = await OrderModel.create({
        restaurant: restaurant._id,
        contactNumber: contactNumber || restaurant.phone,
        additionalNotes,
        products,
        addressText,
        createdBy: req.user._id,
        totalPrice, // السعر الأساسي

        deliveryPrice: deliveryPrice.toString(),
        finalPrice: finalPrice.toString(),

        restaurantLocation: {
            link: restaurantLocationLink,
            latitude: restaurantCoords.latitude,
            longitude: restaurantCoords.longitude
        },
        userLocation: {
            link: userLocationLink,
            latitude: userCoords.latitude,
            longitude: userCoords.longitude
        }
    });

    // 📌 نفس كود الإشعارات من الكود القديم بدون تغيير
    const recipients = [];
    if (restaurant.createdBy?.fcmToken) {
        recipients.push({
            user: restaurant.createdBy._id,
            fcmToken: restaurant.createdBy.fcmToken,
        });
    }
    restaurant.authorizedUsers.forEach(authUser => {
        if (authUser.role === "manager" && authUser.user?.fcmToken) {
            recipients.push({
                user: authUser.user._id,
                fcmToken: authUser.user.fcmToken,
            });
        }
    });

    if (!recipients.length) {
        console.log("⚠️ مفيش حد ليه توكن يوصله إشعار");
    } else {
        for (const recipient of recipients) {
            try {
                await admin.messaging().send({
                    notification: {
                        title: "🚀 طلب جديد",
                        body: "تم استلام طلب جديد"
                    },
                    data: {
                        orderId: order._id.toString(),
                        restaurantId: restaurant._id.toString(),
                        createdAt: order.createdAt.toISOString()
                    },
                    token: recipient.fcmToken,
                });

                await NotificationModell.create({
                    restaurant: restaurant._id,
                    order: order._id,
                    title: "🚀 طلب جديد",
                    body: "تم استلام طلب جديد",
                    fcmToken: recipient.fcmToken,
                });
            } catch (error) {
                console.error("❌ فشل إرسال الإشعار:", error);
            }
        }
    }

    // 📌 إرسال الريسبونس
    res.status(201).json({
        message: "تم إنشاء الأوردر بنجاح",
        data: order
    });
});
















export const createOrderSupermarket = async (req, res, next) => {
    try {
        const {
            supermarket,
            products,
            customItems,
            supermarketLocationLink,
            userLocationLink,
            addressText,
            note,
            contactPhone,
            totalPrice // ⬅️ العميل هو اللي بيبعته
        } = req.body;

        const userId = req.user._id;

        // 📍 استخرج الإحداثيات من اللينكات
        const supermarketCoords = await getCoordinates(supermarketLocationLink);
        const userCoords = await getCoordinates(userLocationLink);

        // ✅ حساب المسافة بالكيلومتر
        const distanceMeters = haversine(
            { lat: userCoords.latitude, lon: userCoords.longitude },
            { lat: supermarketCoords.latitude, lon: supermarketCoords.longitude }
        );
        const distanceKm = distanceMeters / 1000;

        // ✅ حساب سعر التوصيل
        const deliveryPrice = Math.ceil(distanceKm * 5);

        // ✅ المجموع الكلي النهائي
        const finalPrice = Number(totalPrice) + deliveryPrice;

        // 🛒 إنشاء الطلب
        const order = await OrderModellllll.create({
            user: userId,
            supermarket,
            products,
            customItems,
            supermarketLocationLink,
            userLocationLink,
            supermarketLocationLink2: supermarketCoords,
            userLocationLink2: userCoords,
            addressText,
            note,
            contactPhone,

            totalPrice: totalPrice.toString(),  // ⬅️ يتخزن زي ما العميل بعت
            deliveryPrice: deliveryPrice.toString(),
            finalPrice: finalPrice.toString(),

            status: "created"
        });

        // 🚀📌 إشعارات الأونر والمدراء (نفس فكرة المطعم)
        const supermarketDoc = await SupermarketModel.findById(supermarket)
            .populate("createdBy", "name fcmToken")
            .populate("authorizedUsers.user", "name fcmToken");

        const recipients = [];

        if (supermarketDoc?.createdBy?.fcmToken) {
            recipients.push({
                user: supermarketDoc.createdBy._id,
                fcmToken: supermarketDoc.createdBy.fcmToken,
            });
        }

        supermarketDoc?.authorizedUsers?.forEach(authUser => {
            if (authUser.role === "staff" && authUser.user?.fcmToken) {
                recipients.push({
                    user: authUser.user._id,
                    fcmToken: authUser.user.fcmToken,
                });
            }
        });

        if (!recipients.length) {
            console.log("⚠️ مفيش حد ليه توكن يوصله إشعار");
        } else {
            for (const recipient of recipients) {
                try {
                    await admin.messaging().send({
                        notification: {
                            title: "🛒 طلب جديد من السوبرماركت",
                            body: "تم استلام طلب جديد"
                        },
                        data: {
                            orderId: order._id.toString(),
                            supermarketId: supermarketDoc._id.toString(),
                            createdAt: order.createdAt.toISOString()
                        },
                        token: recipient.fcmToken,
                    });

                    await NotificationModell.create({
                        supermarket: supermarketDoc._id,
                        order: order._id,
                        title: "🛒 طلب جديد",
                        body: "تم استلام طلب جديد",
                        deviceToken: recipient.fcmToken,
                    });

                } catch (error) {
                    console.error("❌ فشل إرسال الإشعار:", error);
                }
            }
        }

        return res.status(201).json({
            success: true,
            message: "✅ تم إنشاء الطلب بنجاح",
            data: order
        });
    } catch (error) {
        next(error);
    }
};




export const createService = asyncHandelr(async (req, res, next) => {
    let { serviceName, accountNumber, accountName } = req.body;

    // 🧹 تنظيف
    const trimIfString = (val) => typeof val === "string" ? val.trim() : val;
    serviceName = trimIfString(serviceName);
    accountNumber = trimIfString(accountNumber);
    accountName = trimIfString(accountName);

    if (!serviceName || !accountNumber || !accountName) {
        return next(new Error("❌ جميع الحقول مطلوبة", { cause: 400 }));
    }

    // ⬆️ رفع صورة الخدمة
    let uploadedImage = null;
    if (req.files?.servicePicture?.[0]) {
        const file = req.files.servicePicture[0];
        const uploaded = await cloud.uploader.upload(file.path, {
            folder: `services/images`,
            resource_type: "image",
        });
        uploadedImage = {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id
        };
    }

    const service = await ServiceModel.create({
        serviceName,
        accountNumber,
        accountName,
        servicePicture: uploadedImage
    });

    return res.status(201).json({
        message: "✅ تم إنشاء الخدمة بنجاح",
        data: service
    });
});

export const getServices = asyncHandelr(async (req, res, next) => {
    const services = await ServiceModel.find().sort({ createdAt: -1 });
    return res.status(200).json({
        message: "✅ تم جلب الخدمات",
        data: services
    });
});


export const updateService = asyncHandelr(async (req, res, next) => {
    const { id } = req.params;
    let { serviceName, accountNumber, accountName } = req.body;

    const service = await ServiceModel.findById(id);
    if (!service) return next(new Error("❌ الخدمة غير موجودة", { cause: 404 }));

    // تحديث النصوص
    if (serviceName) service.serviceName = serviceName.trim();
    if (accountNumber) service.accountNumber = accountNumber.trim();
    if (accountName) service.accountName = accountName.trim();

    // ⬆️ تحديث الصورة
    if (req.files?.servicePicture?.[0]) {
        // لو فيه صورة قديمة نحذفها من Cloudinary
        if (service.servicePicture?.public_id) {
            await cloud.uploader.destroy(service.servicePicture.public_id);
        }
        const file = req.files.servicePicture[0];
        const uploaded = await cloud.uploader.upload(file.path, {
            folder: `services/images`,
            resource_type: "image",
        });
        service.servicePicture = {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id
        };
    }

    await service.save();

    return res.status(200).json({
        message: "✅ تم تعديل الخدمة بنجاح",
        data: service
    });
});





import moment from "moment";
import SubscriptionPlan from "../../../DB/models/subscriptionPlanSchema.model.js";
import PaidService from "../../../DB/models/paidServiceSchema.js";
import { RideRequestModel } from "../../../DB/models/rideRequestSchema.model.js";
import PaidServiceDrivers from "../../../DB/models/PaidServiceDrivers.js";
import { ImageModel } from "../../../DB/models/imageSchema.model.js";
import { ReportModel } from "../../../DB/models/reportSchema.js";
import { verifyOTP } from "./authontecation.service.js";
import AppSettingsSchema from "../../../DB/models/AppSettingsSchema.js";
import { Commenttt, Posttt } from "../../../DB/models/reactionSchema.js";
import { PostReport } from "../../../DB/models/postReportSchema.js";
import { PrivacyPolicy } from "../../../DB/models/privacyPolicySchemaaa.js";

export const updateSubscription = asyncHandelr(async (req, res, next) => {
    const { userId } = req.params;
    const { addDays } = req.body;

    if (!addDays || addDays <= 0) {
        return res.status(400).json({ success: false, message: "❌ يجب إدخال عدد أيام صالح" });
    }

    const user = await Usermodel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "❌ المستخدم غير موجود" });

    const now = new Date();

    // لو الاشتراك مش موجود اصلاً
    if (!user.subscription) {
        user.subscription = {
            planType: "FreeTrial",
            startDate: now,
            endDate: moment(now).add(15, "days").toDate()
        };
    }

    let currentEnd = user.subscription.endDate;

    if (moment(currentEnd).isBefore(now)) {
        currentEnd = now; // لو انتهت الاشتراك قبل كده
    }

    // إضافة الأيام الجديدة
    const newEndDate = moment(currentEnd).add(addDays, "days").toDate();

    // تحديث البيانات
    user.subscription.startDate = user.subscription.startDate || now;
    user.subscription.endDate = newEndDate;

    await user.save();

    // حساب الأيام المتبقية والاستخدام
    const daysLeft = moment(newEndDate).diff(moment(now), "days");
    const daysUsed = moment(now).diff(moment(user.subscription.startDate), "days");

    return res.status(200).json({
        success: true,
        message: `✅ تم تحديث الاشتراك (${addDays} يوم إضافي)`,
        data: {
            startDate: user.subscription.startDate,
            endDate: user.subscription.endDate,
            daysLeft,
            daysUsed,
            planType: user.subscription.planType
        }
    });
});





export const createSubscriptionPlan = async (req, res, next) => {
    try {
        const {  price, durationDays  } = req.body;

        if (!price || !durationDays) {
            return res.status(400).json({
                success: false,
                message: "❌ جميع الحقول المطلوبة: name, price, durationDays"
            });
        }

        const plan = await SubscriptionPlan.create({ price, durationDays  });

        return res.status(201).json({
            success: true,
            message: "✅ تم إنشاء الباقة بنجاح",
            data: plan
        });
    } catch (error) {
        next(error);
    }
};



export const updateSubscriptionPlan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { price, durationDays } = req.body;

        // 🔍 تحقق من وجود الباقة
        const plan = await SubscriptionPlan.findById(id);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "❌ الباقة غير موجودة"
            });
        }

        // ✅ تحديث القيم
        if (price !== undefined) plan.price = price;
        if (durationDays !== undefined) plan.durationDays = durationDays;

        await plan.save();

        return res.status(200).json({
            success: true,
            message: "✅ تم تحديث الباقة بنجاح",
            data: plan
        });
    } catch (error) {
        next(error);
    }
};





export const getAllPaidServicesadmin = asyncHandelr(async (req, res, next) => {
    const services = await PaidService.find()
        .populate({
            path: "userId",
            select: "fullName email phone"
        })
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: "✅ تم جلب جميع الخدمات المدفوعة بنجاح",
        count: services.length,
        data: services
    });
});

export const createPaidService = asyncHandelr(async (req, res, next) => {
    let { serviceName, subscriptionDuration, subscriptionPrice, phoneNumber, doctorId, ownerId } = req.body;

    // 🧹 تنظيف النصوص
    const trimIfString = (val) => typeof val === "string" ? val.trim() : val;
    serviceName = trimIfString(serviceName);
    phoneNumber = trimIfString(phoneNumber);

    // ✅ جلب userId من التوكن
    const userId = req.user._id;

    // ⬆️ رفع صورة الفاتورة إذا موجودة
    let uploadedInvoice = null;
    if (req.files?.invoiceImage?.[0]) {
        const file = req.files.invoiceImage[0];
        const uploaded = await cloud.uploader.upload(file.path, {
            folder: `paid_services/invoices`,
            resource_type: "image",
        });
        uploadedInvoice = {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id
        };
    }

    // إنشاء الخدمة المدفوعة
    const service = await PaidService.create({
        serviceName,
        invoiceImage: uploadedInvoice,
        subscriptionDuration,
        subscriptionPrice,
        phoneNumber,
        userId,       // من التوكن
        doctorId,
        ownerId
    });

    return res.status(201).json({
        success: true,
        message: "✅ تم إنشاء الخدمة المدفوعة بنجاح",
        data: service
    });
});



export const getAllPaidServiceDrivers = asyncHandelr(async (req, res, next) => {
    // 🟢 جلب كل الخدمات مع بيانات المستخدم المرتبطة
    const services = await PaidServiceDrivers.find()
        .populate({
            path: "userId",
            model: "User", // تأكد أن الاسم هو نفسه المستخدم في تعريف الموديل User
            select: "fullName email phone"
        })
        .sort({ createdAt: -1 }); // الأحدث أولًا

    return res.status(200).json({
        success: true,
        message: "✅ تم جلب جميع خدمات السائقين المدفوعة بنجاح",
        count: services.length,
        data: services
    });
});




export const createPaidServiceDrivers = asyncHandelr(async (req, res, next) => {
    let { serviceName, PonitsNumber, phoneNumber } = req.body;

    // 🧹 تنظيف النصوص
    const trimIfString = (val) => typeof val === "string" ? val.trim() : val;
    serviceName = trimIfString(serviceName);
    phoneNumber = trimIfString(phoneNumber);

    // ✅ جلب userId من التوكن
    const userId = req.user._id;

    // ⬆️ رفع صورة الفاتورة إذا موجودة
    let uploadedInvoice = null;
    if (req.files?.invoiceImage?.[0]) {
        const file = req.files.invoiceImage[0];
        const uploaded = await cloud.uploader.upload(file.path, {
            folder: `paid_services/invoices`,
            resource_type: "image",
        });
        uploadedInvoice = {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id
        };
    }

    // إنشاء الخدمة المدفوعة
    const service = await PaidServiceDrivers.create({
        serviceName,
        invoiceImage: uploadedInvoice,
        PonitsNumber,
        phoneNumber,
        userId,      // من التوكن
     
    });

    return res.status(201).json({
        success: true,
        message: "✅ تم إنشاء الخدمة المدفوعة بنجاح",
        data: service
    });
});


export const deleteSubscriptionPlan = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 🔍 تحقق من وجود الباقة
        const plan = await SubscriptionPlan.findById(id);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "❌ الباقة غير موجودة"
            });
        }

        await plan.deleteOne();

        return res.status(200).json({
            success: true,
            message: "✅ تم حذف الباقة بنجاح"
        });
    } catch (error) {
        next(error);
    }
};



export const getAllSubscriptionPlans = async (req, res, next) => {
    try {
        const plans = await SubscriptionPlan.find().sort({ price: 1 }); // ترتيب حسب السعر

        return res.status(200).json({
            success: true,
            message: "✅ تم جلب جميع الباقات بنجاح",
            data: plans
        });
    } catch (error) {
        next(error);
    }
};


// export const getRideRequestById = async (req, res) => {
//     try {
//         const { driverId } = req.params;

//         // ✅ جلب الطلب مع التفاصيل
//         const rideRequest = await rideSchema.find({ driverId })
//           // بيانات العميل
//            ; // جلب بيانات الرحلة نفسها لو محتاج

//         if (!rideRequest) {
//             return res.status(404).json({
//                 success: false,
//                 message: "❌ الطلب غير موجود"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: rideRequest
//         });

//     } catch (err) {
//         console.error("❌ Error in getRideRequestById:", err);
//         return res.status(500).json({
//             success: false,
//             message: "⚠️ خطأ أثناء جلب بيانات الطلب"
//         });
//     }
// };

export const getRideRequestById = async (req, res) => {
    try {
        const { driverId } = req.params;

        // ✅ جلب كل الطلبات الخاصة بالسواق مع استبعاد الرحلات المنتهية أو الملغية
        const rides = await rideSchema.find({
            driverId,
            status: { $nin: ["ongoing finished", "CANCELLED"] }
        }).lean();

  if (!rides || rides.length === 0) {
    return res.status(200).json({
        success: true,
        data: []
    });
}


        // 🔹 نضيف rideId و clientName لكل طلب
        const ridesWithExtra = await Promise.all(
            rides.map(async (ride) => {
                const client = await Usermodel.findById(ride.clientId).select("fullName");
                return {
                    ...ride,
                    rideId: ride._id,
                    clientName: client ? client.fullName : "غير معروف",
                };
            })
        );

        return res.status(200).json({
            success: true,
            data: ridesWithExtra
        });

    } catch (err) {
        console.error("❌ Error in getRideRequestById:", err);
        return res.status(500).json({
            success: false,
            message: "⚠️ خطأ أثناء جلب بيانات الطلب"
        });
    }
};

export const deleteMyAccount = asyncHandelr(async (req, res, next) => {
    const userId = req.user._id; // جاي من التوكن

    // 🧩 تحقق أن المستخدم موجود
    const user = await Usermodel.findById(userId);
    if (!user) {
        return next(new Error("❌ المستخدم غير موجود", { cause: 404 }));
    }

    // ⚙️ حذف المستخدم
    await Usermodel.findByIdAndDelete(userId);

    // 💬 ممكن كمان تحذف البيانات المرتبطة بالمستخدم هنا (لو فيه Posts أو Orders ...)
    // await OrderModel.deleteMany({ userId });

    return successresponse(res, "✅ تم حذف الحساب بنجاح", 200);
});

export const deleteUserByAdmin = asyncHandelr(async (req, res, next) => {
    const ownerId = req.user._id; // جاي من التوكن
    const { userId } = req.params;

    // ✅ جلب بيانات المالك
    const owner = await Usermodel.findById(ownerId);
    if (!owner) {
        return next(new Error("❌ المستخدم غير موجود", { cause: 404 }));
    }

    // ✅ السماح فقط للـ Owner أو Admin بالحذف
    if (!["Owner"].includes(owner.accountType)) {
        return next(new Error("🚫 لا تملك صلاحية لحذف المستخدمين", { cause: 403 }));
    }

    

    // ✅ التحقق من وجود المستخدم المطلوب حذفه
    const userToDelete = await Usermodel.findById(userId);
    if (!userToDelete) {
        return next(new Error("❌ المستخدم المطلوب غير موجود", { cause: 404 }));
    }

    // ⚠️ منع المالك أو الأدمن من حذف نفسه
    if (userToDelete._id.toString() === ownerId.toString()) {
        return next(new Error("⚠️ لا يمكنك حذف حسابك بنفسك", { cause: 400 }));
    }

    // ⚙️ حذف المستخدم
    await Usermodel.findByIdAndDelete(userId);

    // 💬 حذف بياناته المرتبطة (اختياري)
    // await OrderModel.deleteMany({ user: userId });
    // await PostModel.deleteMany({ author: userId });

    return successresponse(res, `✅ تم حذف المستخدم (${userToDelete.fullName || "بدون اسم"}) بنجاح`, 200);
});


// ✅ جلب كل الصور
export const getAllImages = asyncHandelr(async (req, res, next) => {
    const images = await ImageModel.find().populate();
    res.status(200).json({
        success: true,
        count: images.length,
        data: images,
    });
});

// ✅ جلب الصور الخاصة بمستخدم معين

export const createReport = asyncHandelr(async (req, res, next) => {
    const { contact, message, name } = req.body;

    if (!contact || !message) {
        return next(new Error("❌ برجاء إدخال وسيلة تواصل والرسالة", { cause: 400 }));
    }

    const report = await ReportModel.create({ contact, message, name });
    return successresponse(res, "✅ تم إرسال البلاغ بنجاح", 201);
});

export const getAllPaidServices = asyncHandelr(async (req, res, next) => {
    const services = await PaidService.find()
        .populate({
            path: "userId",
            select: "fullName email phone"
        })
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: "✅ تم جلب جميع الخدمات المدفوعة بنجاح",
        count: services.length,
        data: services
    });
});






export const getReports = asyncHandelr(async (req, res) => {
    const reports = await ReportModel.find().sort({ createdAt: -1 });
    return successresponse(res, "✅ تم جلب جميع البلاغات بنجاح", 200, reports);
});

export const getNotificationsByUser = asyncHandelr(async (req, res, next) => {
    const { userId } = req.params;

    if (!userId) {
        return next(new Error("❌ يجب إرسال معرف المستخدم userId", { cause: 400 }));
    }

    // 🔍 جلب الإشعارات الخاصة بالمستخدم فقط
    const notifications = await NotificationModell.find({ user: userId })
        .select("title body isRead createdAt")
        .sort({ createdAt: -1 }); // الأحدث أولاً

    // ✅ تنسيق الريسبونس بالشكل المطلوب
    return res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications
    });
});



// 📤 دالة الرفع على Cloudinary
const uploadToCloud = async (file, folder) => {
    const isPDF = file.mimetype === "application/pdf";

    const uploaded = await cloud.uploader.upload(file.path, {
        folder,
        resource_type: isPDF ? "raw" : "auto",
    });

    return {
        secure_url: uploaded.secure_url,
        public_id: uploaded.public_id,
    };
};

// 🧩 تعديل البروفايل
export const updateMyProfile = asyncHandelr(async (req, res, next) => {
    const userId = req.user._id;

    const user = await Usermodel.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "⚠️ المستخدم غير موجود",
        });
    }

    const {
        fullName,
        email,
        phone,
        totalPoints,
        modelcar,
        serviceType,
    } = req.body;

    const updatedData = {
        fullName: fullName || user.fullName,
        email: email || user.email,
        phone: phone || user.phone,
        totalPoints: totalPoints || user.totalPoints,
        modelcar: modelcar || user.modelcar,
        serviceType: serviceType || user.serviceType,
    };

    const uploadedFiles = {};

    // ⚙️ إدارة صور العربية (إضافة / حذف)
    let finalCarImages = Array.isArray(user.carImages) ? [...user.carImages] : [];

    // 🗑️ 1- حذف صور تم تحديدها للحذف
    if (req.body.removedCarImages) {
        let removed = [];
        try {
            removed = JSON.parse(req.body.removedCarImages);
        } catch {
            removed = req.body.removedCarImages;
        }

        if (Array.isArray(removed)) {
            for (const imgId of removed) {
                const img = finalCarImages.find(c => c.public_id === imgId);
                if (img) {
                    // حذف الصورة من Cloudinary
                    await cloud.uploader.destroy(img.public_id);
                    // حذفها من الـ Array
                    finalCarImages = finalCarImages.filter(c => c.public_id !== imgId);
                }
            }
        }
    }

    // 🆕 2- إضافة الصور الجديدة
    if (req.files?.carImages) {
        const files = Array.isArray(req.files.carImages)
            ? req.files.carImages
            : [req.files.carImages];

        for (const file of files) {
            const uploaded = await uploadToCloud(file, `users/carImages`);
            finalCarImages.push(uploaded);
        }
    }

    uploadedFiles.carImages = finalCarImages;

    // 🧍‍♂️ صورة البروفايل
    if (req.files?.profiePicture?.[0]) {
        uploadedFiles.profiePicture = await uploadToCloud(
            req.files.profiePicture[0],
            `users/profilePictures`
        );
    } else {
        uploadedFiles.profiePicture = user.profiePicture;
    }

    // 💾 تحديث المستخدم
    const updatedUser = await Usermodel.findByIdAndUpdate(
        userId,
        { ...updatedData, ...uploadedFiles },
        { new: true }
    ).select(
        "fullName email phone totalPoints modelcar serviceType carImages profiePicture"
    );

    return res.status(200).json({
        success: true,
        message: "✅ تم تحديث البروفايل بنجاح",
        data: updatedUser,
    });
});
