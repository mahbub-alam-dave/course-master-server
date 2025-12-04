import express from "express"
import { authenticateUser } from "../../middleware/auth.middleware.js";
import { confirmPayment, createPaymentIntent } from "./payment.controllers.js";

const router = express.Router()

// Create payment intent (protected route)
router.post('/create-payment-intent', authenticateUser, createPaymentIntent);

// Confirm payment and create enrollment (protected route)
router.post('/confirm-payment', authenticateUser, confirmPayment);

export default router;