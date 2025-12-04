import Stripe from "stripe";
import config from "../../config/config.js";
import { createStripePaymentIntent } from "./payment.services.js";

const stripe = new Stripe(config.stripeSecretKey);

// Create payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { courseId, amount, currency = 'usd' } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!courseId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and amount are required'
      });
    }

    const paymentIntent = await createStripePaymentIntent({
      userId,
      courseId,
      amount,
      currency
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};