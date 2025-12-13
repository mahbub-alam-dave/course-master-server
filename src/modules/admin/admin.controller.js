import { fetchDashboardStats } from "./admin.services.js";

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
