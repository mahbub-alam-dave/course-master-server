import Stripe from 'stripe';
import config from "../../config/config.js";
import { paymentsCollection } from '../../models/payment.js';
import { enrollmentCollection } from '../../models/enrollment.js';
import { CourseCollection } from '../../models/courses.js';

const stripe = new Stripe(config.stripeSecretKey);
const paymentCol = paymentsCollection();
const enrollStatistics = enrollmentCollection();
const courseCol = CourseCollection()

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

// Process payment confirmation and create enrollment
export const processPaymentConfirmation = async ({
  userId,
  userName,
  userEmail,
  courseId,
  paymentIntent
}) => {
  try {
    // Check if already enrolled
    const existingEnrollment = await enrollStatistics.findOne({
      'user.userId': userId,
      'course.courseId': courseId
    });

    if (existingEnrollment) {
      throw new Error('You are already enrolled in this course');
    }

    // Fetch course details
    const course = await courseCol.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Create payment record
    const payment = await paymentCol.create({
      user: {
        userId,
        name: userName,
        email: userEmail
      },
      course: {
        courseId: course._id,
        title: course.title,
        thumbnail: course.thumbnail
      },
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency.toUpperCase(),
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: paymentIntent.customer || null,
      status: 'succeeded',
      paymentDate: new Date()
    });

    // Create enrollment record
    const enrollment = await enrollStatistics.create({
      user: {
        userId,
        name: userName,
        email: userEmail
      },
      course: {
        courseId: course._id,
        title: course.title,
        instructor: {
          name: course.instructor?.name,
          id: course.instructor?.id
        },
        category: course.category,
        thumbnail: course.thumbnail
      },
      payment: {
        paymentId: payment._id,
        amount: payment.amount,
        currency: payment.currency
      },
      enrollmentDate: new Date(),
      enrollmentStatus: 'active',
      progress: {
        completedLectures: 0,
        totalLectures: course.totalLectures || 0,
        completionPercentage: 0,
        lastAccessedDate: new Date(),
        completedSections: []
      },
      certificate: {
        issued: false
      },
      accessExpiry: {
        hasExpiry: course.accessType === 'subscription',
        expiryDate: course.accessType === 'subscription' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
          : null
      }
    });

    // Update course enrollment count
    await courseCol.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 }
    });

    return {
      payment,
      enrollment
    };
  } catch (error) {
    throw new Error(`Error processing payment: ${error.message}`);
  }
};