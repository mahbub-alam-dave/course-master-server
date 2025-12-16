import express from "express"
import { authenticateUser, requireAdmin } from "../../middleware/auth.middleware.js";
import { getDashboardStats, getRecentEnrollments, getTopCourses } from "./admin.controller.js";

const router = express.Router()

// All routes require admin authentication
router.use(authenticateUser, requireAdmin);

// Dashboard overview stats
router.get('/stats', getDashboardStats);
// recent enrollments
router.get('/recent-enrollments', getRecentEnrollments);
// Top performing courses
router.get('/top-courses', getTopCourses);

export const adminRoutes = router;