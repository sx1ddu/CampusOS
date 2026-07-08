import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getResources);
router.get('/:id', getResourceById);
// Upload images to Cloudinary first, then create the resource with those URLs.
router.post('/', protect, upload.array('images', 5), createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);

export default router;
