import { fetchDashboardStats, fetchRecentEnrollments, fetchTopCourses } from "./admin.services.js";

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
