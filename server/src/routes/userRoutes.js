import express from 'express';
import { getMyProfile, getUserProfile, updateMyProfile, updateAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.put('/me/avatar', protect, upload.single('avatar'), updateAvatar);
router.get('/:id', getUserProfile);

export default router;
