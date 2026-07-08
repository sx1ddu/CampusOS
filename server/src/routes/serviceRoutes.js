import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices,
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getServices);
// /my-services must come before /:id, or Express would treat "my-services" as an id.
router.get('/my-services', protect, getMyServices);
router.get('/:id', getServiceById);
// upload.array runs first to send images to Cloudinary before createService runs.
router.post('/', protect, upload.array('images', 5), createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

export default router;
