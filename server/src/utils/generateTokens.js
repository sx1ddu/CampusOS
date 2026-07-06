import jwt from 'jsonwebtoken';

// Access token: short-lived, sent with every request to prove identity.
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
};

// Refresh token: long-lived, used only to get a new access token
// once the old one expires. We store this one in the database too,
// so we can invalidate it on logout.
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
};
