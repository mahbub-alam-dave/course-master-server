import express from "express"
import { authenticateUser, requireAdmin } from "../../middleware/auth.middleware.js";
import { getDashboardStats, getRecentEnrollments } from "./admin.controller.js";

const router = express.Router()

// All routes require admin authentication
router.use(authenticateUser, requireAdmin);

// Dashboard overview stats
router.get('/stats', getDashboardStats);
// recent enrollments
router.get('/recent-enrollments', getRecentEnrollments);

export const adminRoutes = router;