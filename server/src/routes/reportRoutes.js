import express from 'express';
import { createReport, getReports, resolveReport } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../constants/enums.js';

const router = express.Router();

router.post('/', protect, createReport);
router.get('/', protect, authorize(ROLES.ADMIN), getReports);
router.put('/:id/resolve', protect, authorize(ROLES.ADMIN), resolveReport);

export default router;
