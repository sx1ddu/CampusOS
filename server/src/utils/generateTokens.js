import jwt from 'jsonwebtoken';

// Generate a JWT access token after successful login.
// This is short-lived and sent with every request to prove who the user is.
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
};

// Generate a JWT refresh token.
// This lives longer and is only used to get a new access token later.
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
};
