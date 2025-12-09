import express from "express"
import { checkEnrollment, getUserEnrollments } from "./enrollment.controllers.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router()

// Check if user is enrolled in a course (protected)
router.get('/check/:courseId', authenticateUser, checkEnrollment);
router.get('/my-courses', authenticateUser, getUserEnrollments);

export default router;