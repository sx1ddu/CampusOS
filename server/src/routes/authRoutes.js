import express from 'express';
import { body } from 'express-validator';
import {
  register,
  verifyEmail,
  login,
  googleLogin,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

// express-validator rules run first, then validateRequest checks the result
// before the request even reaches the controller.
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  register
);

router.get('/verify-email/:token', verifyEmail);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty()],
  validateRequest,
  login
);

router.post('/google', googleLogin);
router.post('/refresh-token', refreshAccessToken);
// protect middleware runs first - only a logged-in user can log out.
router.post('/logout', protect, logout);
router.post('/forgot-password', body('email').isEmail(), validateRequest, forgotPassword);
router.post(
  '/reset-password/:token',
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validateRequest,
  resetPassword
);

export default router;
