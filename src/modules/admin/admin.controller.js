import { fetchAllUsers, fetchCourseAnalytics, fetchDashboardStats, fetchRecentEnrollments, fetchRevenueChart, fetchTopCourses } from "./admin.services.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { dateRange = 'all', courseId = 'all' } = req.query;

    const stats = await fetchDashboardStats({ dateRange, courseId });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

// / Get recent enrollments
export const getRecentEnrollments = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const enrollments = await fetchRecentEnrollments(limit);

    res.status(200).json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error('Error fetching recent enrollments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent enrollments',
      error: error.message
    });
  }
};


// Get top performing courses
export const getTopCourses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const topCourses = await fetchTopCourses(limit);

    res.status(200).json({
      success: true,
      data: topCourses
    });
  } catch (error) {
    console.error('Error fetching top courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top courses',
      error: error.message
    });
  }
};

// Get revenue chart data
export const getRevenueChart = async (req, res) => {
  try {
    const { dateRange = 'month' } = req.query;

    const revenueData = await fetchRevenueChart(dateRange);

    res.status(200).json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    console.error('Error fetching revenue chart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue chart',
      error: error.message
    });
  }
};


// Get all users for user management
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role || 'all';

    const result = await fetchAllUsers({ page, limit, role });

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalUsers: result.totalUsers,
        limit: result.limit
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};


// Get analytics for specific course
export const getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;

    const analytics = await fetchCourseAnalytics(courseId);

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course analytics',
      error: error.message
    });
  }
};
