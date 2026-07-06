import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Instead of saving uploaded files to our own disk, we stream them
// straight to Cloudinary and just keep the returned image URL.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campusos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// Reject anything bigger than 5MB or files that aren't images.
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
