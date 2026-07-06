import { v2 as cloudinary } from 'cloudinary';

// Cloudinary is used to store uploaded images (profile pictures,
// service images, resource images) instead of saving them on our own server.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
