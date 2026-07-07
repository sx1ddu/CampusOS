import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import sendEmail from '../utils/sendEmail.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Sends both tokens back to the client: refresh token as an httpOnly
// cookie (safer, JS on the frontend can't read it) and access token
// in the JSON body (the frontend keeps it in memory and sends it in
// the Authorization header on every request).
const sendTokens = async (user, statusCode, res, message) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(statusCode).json(
    new ApiResponse(statusCode, message, {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    })
  );
};

// @desc    Register a new student account
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, college } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  await Profile.create({ user: user._id, college });

  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your CampusOS account',
    html: `<p>Hi ${user.name}, click below to verify your email:</p>
           <a href="${verifyUrl}">${verifyUrl}</a>`,
  });

  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, 'Registered! Please check your email to verify your account.'));
});

// @desc    Verify email using the token sent to the user's inbox
// @route   GET /api/auth/verify-email/:token
export const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Verification link is invalid or has expired');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Email verified successfully'));
});

// @desc    Log in with email and password
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  if (!user.isEmailVerified) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Please verify your email before logging in');
  }

  await sendTokens(user, HTTP_STATUS.OK, res, 'Logged in successfully');
});

// @desc    Log in / sign up using a Google ID token from the frontend
// @route   POST /api/auth/google
export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      name: payload.name,
      email: payload.email,
      googleId: payload.sub,
      avatar: payload.picture,
      isEmailVerified: true, // Google has already verified this email
    });
    await Profile.create({ user: user._id });
  }

  await sendTokens(user, HTTP_STATUS.OK, res, 'Logged in with Google');
});

// @desc    Get a new access token using the refresh token cookie
// @route   POST /api/auth/refresh-token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;
  if (!incomingToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'No refresh token provided');
  }

  const user = await User.findOne({ refreshToken: incomingToken });
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid refresh token');
  }

  const accessToken = generateAccessToken(user._id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'New access token issued', { accessToken }));
});

// @desc    Log out - clears the refresh token
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.clearCookie('refreshToken');
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Logged out successfully'));
});

// @desc    Request a password reset email
// @route   POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  // We don't reveal whether the email exists, to avoid leaking
  // which emails are registered.
  if (!user) {
    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, 'If that email exists, a reset link has been sent'));
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your CampusOS password',
    html: `<p>Click below to reset your password (valid for 1 hour):</p>
           <a href="${resetUrl}">${resetUrl}</a>`,
  });

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'If that email exists, a reset link has been sent'));
});

// @desc    Reset password using the token from the email
// @route   POST /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Reset link is invalid or has expired');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Password reset successfully. Please log in.'));
});
