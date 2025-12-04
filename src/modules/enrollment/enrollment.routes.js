import express from "express"
import { checkEnrollment } from "./enrollment.controllers.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router()

// Check if user is enrolled in a course (protected)
router.get('/check/:courseId', authenticateUser, checkEnrollment);

export default router;