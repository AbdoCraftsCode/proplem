// utlis/multer/cloud.multer.js or wherever your fileValidationTypes is
import multer from "multer";

export const fileValidationTypes = {
    image: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
    document: ['application/json', 'application/pdf'],
    audio: [
        'audio/mpeg',       // mp3
        'audio/wav',        // wav
        'audio/ogg',        // ogg
        'audio/webm',       // webm
        'audio/aac',        // aac
        'audio/x-m4a',      // m4a
        'audio/mp4',        // mp4, m4a
        'audio/x-wav',      // wav
        'audio/amr',        // amr - common for voice recordings
        'audio/x-ms-wma'    // wma
    ]
};

export const uploadCloudFile = (fileValidation = []) => {
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        if (fileValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("❌ الملف غير مدعوم!"), false);
        }
    }

    return multer({ 
        storage, 
        fileFilter,
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB max for voice
        }
    });
};