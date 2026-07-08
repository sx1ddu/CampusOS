import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import RentalBooking from '../models/RentalBooking.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/paymentService.js';
import { notifyUser } from '../services/notificationService.js';
import { PAYMENT_STATUS, NOTIFICATION_TYPES } from '../constants/enums.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// @desc    Create a Razorpay order for a booking or rental
// @route   POST /api/payments/create-order
export const createOrder = asyncHandler(async (req, res) => {
  const { bookingId, rentalId } = req.body;

  // Only one of bookingId/rentalId is expected - look up whichever was sent.
  const transaction = bookingId ? await Booking.findById(bookingId) : await RentalBooking.findById(rentalId);
  if (!transaction) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Booking not found');
  }

  // Ask Razorpay to create an order for this amount - the frontend uses
  // this order ID to open the Razorpay checkout popup.
  const order = await createRazorpayOrder(transaction.amount);

  // Keep our own record of this payment attempt so we can verify it later.
  const payment = await Payment.create({
    user: req.user._id,
    bookingId,
    rentalId,
    razorpayOrderId: order.id,
    amount: transaction.amount,
  });

  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, 'Order created', { order, paymentId: payment._id }));
});

// @desc    Verify a completed Razorpay payment
// @route   POST /api/payments/verify
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Recreate the signature ourselves and compare it - this proves the
  // payment really came from Razorpay and wasn't faked by the client.
  const isValid = verifyRazorpaySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Payment verification failed');
  }

  // Signature is valid - update our payment record to PAID.
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { razorpayPaymentId: razorpay_payment_id, status: PAYMENT_STATUS.PAID },
    { new: true }
  );

  if (!payment) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Payment record not found');
  }

  // Mark the related booking/rental as paid.
  if (payment.bookingId) {
    await Booking.findByIdAndUpdate(payment.bookingId, { isPaid: true });
  } else if (payment.rentalId) {
    await RentalBooking.findByIdAndUpdate(payment.rentalId, { isPaid: true });
  }

  await notifyUser(req.user._id, NOTIFICATION_TYPES.PAYMENT_SUCCESS, 'Your payment was successful');

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Payment verified successfully', payment));
});
