import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Creates a Razorpay order. Amount is in rupees here; Razorpay wants paise.
export const createRazorpayOrder = async (amountInRupees) => {
  const order = await razorpay.orders.create({
    amount: amountInRupees * 100,
    currency: 'INR',
  });
  return order;
};

// Verifies that a payment really came from Razorpay by recreating the
// signature on our server and comparing it to the one the client sent.
export const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};
