import Service from '../models/Service.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// @desc    Browse services with optional search/category/price filters
// @route   GET /api/services
export const getServices = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

  // Build the MongoDB filter step by step based on which query params were sent.
  const filter = { isDeleted: false, status: 'active' };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  // Uses the text index defined on the Service model for keyword search.
  if (search) filter.$text = { $search: search };

  const services = await Service.find(filter)
    .populate('provider', 'name avatar')
    .populate('category', 'name')
    .sort('-createdAt')
    // Skip past earlier pages, then limit to this page's page size.
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Service.countDocuments(filter);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Services fetched', {
      services,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    })
  );
});

// @desc    Get a single service by ID
// @route   GET /api/services/:id
export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ _id: req.params.id, isDeleted: false })
    .populate('provider', 'name avatar')
    .populate('category', 'name');

  if (!service) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Service not found');
  }

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Service fetched', service));
});

// @desc    Create a new service listing
// @route   POST /api/services
export const createService = asyncHandler(async (req, res) => {
  const { title, description, category, price, deliveryTimeDays, tags } = req.body;

  // req.files is populated by the upload middleware after images are sent to Cloudinary.
  const images = req.files ? req.files.map((file) => file.path) : [];

  const service = await Service.create({
    title,
    description,
    category,
    price,
    deliveryTimeDays,
    tags,
    images,
    provider: req.user._id,
  });

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'Service created', service));
});

// @desc    Update a service (only the owner can do this)
// @route   PUT /api/services/:id
export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service || service.isDeleted) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Service not found');
  }

  // Check if the logged-in user owns this service before letting them edit it.
  if (service.provider.toString() !== req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only edit your own services');
  }

  // Only update fields that were actually sent, and only from this allowed list.
  const allowedFields = ['title', 'description', 'price', 'deliveryTimeDays', 'tags', 'status'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) service[field] = req.body[field];
  });

  await service.save();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Service updated', service));
});

// @desc    Soft delete a service
// @route   DELETE /api/services/:id
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service || service.isDeleted) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Service not found');
  }

  if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only delete your own services');
  }

  // Soft delete - we keep the record but hide it from listings,
  // since old bookings still reference this service.
  service.isDeleted = true;
  await service.save();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Service deleted'));
});

// @desc    Get all services listed by the logged-in user
// @route   GET /api/services/my-services
export const getMyServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ provider: req.user._id, isDeleted: false }).sort('-createdAt');
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Your services fetched', services));
});
