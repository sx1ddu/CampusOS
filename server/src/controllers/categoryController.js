import Category from '../models/Category.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// @desc    Get all categories (used to populate dropdowns on the frontend)
// @route   GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const filter = req.query.type ? { type: req.query.type } : {};
  const categories = await Category.find(filter).sort('name');
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Categories fetched', categories));
});

// @desc    Create a new category (admin only)
// @route   POST /api/categories
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'Category created', category));
});
