
import { asyncHandelr } from "../../../utlis/response/error.response.js";
import cloudinary from '../../../utlis/multer/cloudinary.js';
import fs from 'fs';


const validateVoiceFile = (file) => {
    if (!file) {
        throw new Error('Voice file is required');
    }

    if (!fs.existsSync(file.path)) {
        throw new Error('Voice file not found on server');
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('Voice file is too large. Maximum size is 10MB');
    }

    const minSize = 1024;
    if (file.size < minSize) {
        throw new Error('Voice file is too small');
    }

    const allowedExtensions = ['.mp3', '.wav', '.ogg', '.webm', '.m4a', '.aac', '.amr', '.mp4'];
    const fileExtension = file.originalname
        .substring(file.originalname.lastIndexOf('.'))
        .toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        throw new Error(`Unsupported audio format. Allowed formats: ${allowedExtensions.join(', ')}`);
    }

    return true;
};

const uploadVoiceToCloudinary = async (file, groupId) => {
    try {
        validateVoiceFile(file);

        if (!cloudinary.config().cloud_name) {
            throw new Error('Cloudinary is not properly configured');
        }

        const uploadOptions = {
            folder: groupId ? `chat_voices/group_${groupId}` : 'chat_voices',
            resource_type: 'auto',
        };

        const uploaded = await cloudinary.uploader.upload(file.path, uploadOptions);

        return {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
            duration: uploaded.duration || 0,
            format: uploaded.format,
            size: uploaded.bytes,
            duration_seconds: Math.round(uploaded.duration || 0)
        };
    } catch (error) {
        throw new Error(`Failed to upload voice: ${error.message}`);
    } finally {
        try {
            if (file && file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        } catch (cleanupError) {}
    }
};

export const uploadVoice = asyncHandelr(async (req, res, next) => {
    try {
        if (!req.files?.voice || !req.files.voice[0]) {
            return next(new Error('Please provide a voice file'));
        }

        const voiceFile = req.files.voice[0];
        const userId = req.user._id;
        const { groupId } = req.body;

        if (!groupId) {
            return next(new Error('Group ID is required'));
        }

        const voiceData = await uploadVoiceToCloudinary(voiceFile, groupId);

        res.status(200).json({
            success: true,
            message: 'Voice uploaded successfully',
            voiceUrl: voiceData.url,
            metadata: {
                duration: voiceData.duration_seconds,
                size: voiceData.size,
                public_id: voiceData.public_id,
                format: voiceData.format
            }
        });

    } catch (error) {
        next(error);
    }
});

export const deleteVoiceFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;
        
        await cloudinary.uploader.destroy(publicId, {
            resource_type: 'video'
        });
    } catch (error) {}
};