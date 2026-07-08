import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../constants/enums.js';

const router = express.Router();

router.get('/', getCategories);
// Only logged-in admins can create new categories.
router.post('/', protect, authorize(ROLES.ADMIN), createCategory);

export default router;
