import express from "express"
import { authenticateUser } from "../../middleware/auth.middleware.js";
import { createPaymentIntent } from "./payment.controllers.js";

const router = express.Router()

// Create payment intent (protected route)
router.post('/create-payment-intent', authenticateUser, createPaymentIntent);

export default router;