import Stripe from "stripe";
import config from "../../config/config.js";
import { createStripePaymentIntent, processPaymentConfirmation } from "./payment.services.js";

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


// Confirm payment and create enrollment
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, courseId } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;
    const userName = req.user.name;

    if (!paymentIntentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID and Course ID are required'
      });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment has not been completed'
      });
    }

    // Process payment and create enrollment
    const result = await processPaymentConfirmation({
      userId,
      userName,
      userEmail,
      courseId,
      paymentIntent
    });

    res.status(200).json({
      success: true,
      message: 'Payment confirmed and enrollment created successfully',
      data: {
        payment: result.payment,
        enrollment: result.enrollment
      }
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    
    if (error.message.includes('already enrolled')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
};