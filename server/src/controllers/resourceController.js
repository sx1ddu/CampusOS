import Resource from '../models/Resource.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// @desc    Browse resources
// @route   GET /api/resources
export const getResources = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 12 } = req.query;

  const filter = { isDeleted: false, isAvailable: true };
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const resources = await Resource.find(filter)
    .populate('owner', 'name avatar')
    .populate('category', 'name')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Resource.countDocuments(filter);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Resources fetched', { resources, total }));
});

// @desc    Get a single resource
// @route   GET /api/resources/:id
export const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findOne({ _id: req.params.id, isDeleted: false }).populate('owner', 'name avatar');

  if (!resource) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Resource not found');
  }

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Resource fetched', resource));
});

// @desc    List a new resource for rent
// @route   POST /api/resources
export const createResource = asyncHandler(async (req, res) => {
  const { title, description, category, rentPerDay, depositAmount } = req.body;
  // Cloudinary upload already happened in the upload middleware - just grab the URLs.
  const images = req.files ? req.files.map((file) => file.path) : [];

  const resource = await Resource.create({
    title,
    description,
    category,
    rentPerDay,
    depositAmount,
    images,
    owner: req.user._id,
  });

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'Resource listed', resource));
});

// @desc    Update a resource (owner only)
// @route   PUT /api/resources/:id
export const updateResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource || resource.isDeleted) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Resource not found');
  }

  // Check if the logged-in user owns this resource before letting them edit it.
  if (resource.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only edit your own resources');
  }

  const allowedFields = ['title', 'description', 'rentPerDay', 'depositAmount', 'isAvailable'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) resource[field] = req.body[field];
  });

  await resource.save();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Resource updated', resource));
});

// @desc    Soft delete a resource
// @route   DELETE /api/resources/:id
export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource || resource.isDeleted) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Resource not found');
  }

  if (resource.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only delete your own resources');
  }

  // Soft delete - keep the record so past rentals still make sense, just hide it from browsing.
  resource.isDeleted = true;
  await resource.save();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Resource deleted'));
});
