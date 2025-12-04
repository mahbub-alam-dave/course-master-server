import Stripe from 'stripe';
import config from "../../config/config.js";
import { paymentsCollection } from '../../models/payment.js';
import { enrollmentCollection } from '../../models/enrollment.js';
import { CourseCollection } from '../../models/courses.js';
import { ObjectId } from 'mongodb';

const stripe = new Stripe(config.stripeSecretKey);
  // Collections
  const enrollCollection = enrollmentCollection(); // Already defined as native collection
  const courseCollection = CourseCollection();
  const paymentCollection = paymentsCollection();

// Create Stripe payment intent
export const createStripePaymentIntent = async ({ userId, courseId, amount, currency }) => {

  try {
    // Check if user is already enrolled
    const existingEnrollment = await enrollCollection.findOne({
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
    // Convert courseId to ObjectId
    const courseObjectId = new ObjectId(courseId);

    // Check existing enrollment
    const existingEnrollment = await enrollCollection.findOne({
      "user.userId": userId,
      "course.courseId": courseId
    });

    if (existingEnrollment) {
      throw new Error("You are already enrolled in this course");
    }

    // Fetch course details
    const course = await courseCollection.findOne({ _id: courseObjectId });
    if (!course) {
      throw new Error("Course not found");
    }

    // Create payment record
    const paymentData = {
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
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: paymentIntent.customer || null,
      status: "succeeded",
      paymentDate: new Date()
    };

    const paymentResult = await paymentCollection.insertOne(paymentData);

    // Create enrollment record
    const enrollmentData = {
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
        paymentId: paymentResult.insertedId,
        amount: paymentData.amount,
        currency: paymentData.currency
      },
      enrollmentDate: new Date(),
      enrollmentStatus: "active",
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
        hasExpiry: course.accessType === "subscription",
        expiryDate:
          course.accessType === "subscription"
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            : null
      }
    };

    const enrollmentResult = await enrollCollection.insertOne(enrollmentData);

    // Update course enrollment count
    await courseCollection.updateOne(
      { _id: courseObjectId },
      { $inc: { enrollmentCount: 1 } }
    );

    return {
      payment: paymentResult,
      enrollment: enrollmentResult
    };
  } catch (error) {
    throw new Error(`Error processing payment: ${error.message}`);
  }
};