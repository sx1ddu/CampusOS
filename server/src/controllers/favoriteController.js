import Favorite from '../models/Favorite.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// @desc    Add an item to favorites
// @route   POST /api/favorites
export const addFavorite = asyncHandler(async (req, res) => {
  const { itemType, itemId } = req.body;

  const alreadyExists = await Favorite.findOne({ user: req.user._id, itemType, itemId });
  if (alreadyExists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Already in your favorites');
  }

  const favorite = await Favorite.create({ user: req.user._id, itemType, itemId });
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'Added to favorites', favorite));
});

// @desc    Remove an item from favorites
// @route   DELETE /api/favorites/:id
export const removeFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!favorite) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Favorite not found');
  }
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Removed from favorites'));
});

// @desc    Get all favorites of the logged-in user
// @route   GET /api/favorites
export const getMyFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id }).sort('-createdAt');
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Favorites fetched', favorites));
});
