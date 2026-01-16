import express from "express";
import {
  authentication,
  authorization,
} from "../../middlewere/authontcation.middlewere.js";
import {
  createGroup,
  joinAsActive,
  joinAsGuest,
  getUserGroups,
  getGroupMessages,
} from "./services/group.service.js";

import {uploadVoice} from "./services/voice.service.js"
import {uploadCloudFile , fileValidationTypes} from "./multerUpload.js"

const router = express.Router();

router.use(authentication());

router.post("/create", createGroup);
router.post("/join-active", joinAsActive);
router.post("/join-guest", joinAsGuest);
router.get("/my-groups", getUserGroups);
router.get("/:groupId", getGroupMessages);

const voiceUploadMiddleware = uploadCloudFile([
  ...fileValidationTypes.audio 
]).fields([
  { name: 'voice', maxCount: 1 }
]);


router.post(
  '/upload',
  voiceUploadMiddleware,
  uploadVoice
);



export default router;