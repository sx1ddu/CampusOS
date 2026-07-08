import { v2 as cloudinary } from 'cloudinary';

// Set up Cloudinary so we can store uploaded images (avatars, service and resource photos)
// instead of saving files on our own server.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
