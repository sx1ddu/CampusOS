import express from 'express';
import { getMyProfile, getUserProfile, updateMyProfile, updateAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/my-profile', protect, getMyProfile);
router.put('/my-profile', protect, updateMyProfile);
router.put('/my-profile/avatar', protect, upload.single('avatar'), updateAvatar);
router.get('/:id', getUserProfile);

export default router;
