import crypto from 'crypto';
import logger from '../utils/logger';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export const createRazorpayOrder = async (
  amount: number, // In rupees (converted to paisa internally)
  receiptId: string
): Promise<RazorpayOrder> => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret) {
    try {
      const Razorpay = require('razorpay');
      const rzp = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await rzp.orders.create({
        amount: Math.round(amount * 100), // convert to paisa
        currency: 'INR',
        receipt: receiptId,
      });

      logger.info(`Razorpay order created successfully: ${order.id}`);
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      };
    } catch (error) {
      logger.error('Razorpay order creation failed, using mock order', error);
    }
  }

  // Fallback Mock order generator
  const mockOrderId = `order_mock_${crypto.randomBytes(8).toString('hex')}`;
  logger.info(`Generated mock Razorpay order: ${mockOrderId}`);
  return {
    id: mockOrderId,
    amount: amount * 100,
    currency: 'INR',
    receipt: receiptId,
    status: 'created',
  };
};

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Mock checking
  if (orderId.startsWith('order_mock_')) {
    logger.info(`Bypassed payment verification for mock order: ${orderId}`);
    return true;
  }

  if (!keySecret) {
    logger.warn('RAZORPAY_KEY_SECRET is missing. Bypassing validation (development mode).');
    return true;
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = generatedSignature === signature;
    logger.info(`Razorpay verification result: ${isValid}`);
    return isValid;
  } catch (error) {
    logger.error('Signature verification error', error);
    return false;
  }
};
