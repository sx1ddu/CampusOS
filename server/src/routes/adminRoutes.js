import express from 'express';
import { body } from 'express-validator';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteCategory,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { ROLES } from '../constants/enums.js';

const router = express.Router();

// Every route in this file requires a logged-in admin - enforced once
// here instead of repeating protect/authorize on each route below.
router.use(protect, authorize(ROLES.ADMIN));

router.get('/stats', getDashboardStats);

router.get('/users', getAllUsers);
router.put('/users/:id/role', body('role').notEmpty(), validateRequest, updateUserRole);
router.put('/users/:id/status', toggleUserStatus);

router.delete('/categories/:id', deleteCategory);

export default router;
