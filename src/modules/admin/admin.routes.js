import express from "express"
import { authenticateUser, requireAdmin } from "../../middleware/auth.middleware.js";
import { getAllUsers, getCourseAnalytics, getDashboardStats, getRecentEnrollments, getRevenueChart, getTopCourses } from "./admin.controller.js";

const router = express.Router()

// All routes require admin authentication
router.use(authenticateUser, requireAdmin);

// Dashboard overview stats
router.get('/stats', getDashboardStats);
// recent enrollments
router.get('/recent-enrollments', getRecentEnrollments);
// Top performing courses
router.get('/top-courses', getTopCourses);
// Revenue chart data
router.get('/revenue-chart', getRevenueChart);
// User management
router.get('/users', getAllUsers);
// Course-specific analytics
router.get('/course-analytics/:courseId', getCourseAnalytics);

export const adminRoutes = router;