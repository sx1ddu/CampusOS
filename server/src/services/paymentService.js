import Razorpay from 'razorpay';
import crypto from 'crypto';

// Razorpay client set up once using our API keys from .env.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order. Amount is in rupees here, but Razorpay expects paise (x100).
export const createRazorpayOrder = async (amountInRupees) => {
  const order = await razorpay.orders.create({
    amount: amountInRupees * 100,
    currency: 'INR',
  });
  return order;
};

// Verify a completed payment by recreating Razorpay's signature on our
// server and comparing it to the one the client sent.
export const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};
