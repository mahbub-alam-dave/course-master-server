import Stripe from 'stripe';
import config from "../../config/config.js";
import { paymentsCollection } from '../../models/payment.js';
import { enrollmentCollection } from '../../models/enrollment.js';
import { CourseCollection } from '../../models/courses.js';

const stripe = new Stripe(config.stripeSecretKey);
const Payment = paymentsCollection()
const enrollStatistics = enrollmentCollection()
const course = CourseCollection()

// Create Stripe payment intent
export const createStripePaymentIntent = async ({ userId, courseId, amount, currency }) => {

  try {
    // Check if user is already enrolled
    const existingEnrollment = await enrollStatistics.findOne({
      'user.userId': userId,
      'course.courseId': courseId,
      enrollmentStatus: 'active'
    });

    if (existingEnrollment) {
      throw new Error('You are already enrolled in this course');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        userId,
        courseId
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    return paymentIntent;
  } catch (error) {
    throw new Error(`Error creating payment intent: ${error.message}`);
  }
};