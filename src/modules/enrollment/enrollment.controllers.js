import { checkUserEnrollment, fetchUserEnrollments } from "./enrollment.services.js";

// / Check if user is enrolled
export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const isEnrolled = await checkUserEnrollment(userId, courseId);

    res.status(200).json({
      success: true,
      isEnrolled
    });
  } catch (error) {
    console.error('Error checking enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check enrollment',
      error: error.message
    });
  }
};

// Get all user enrollments
export const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'active';

    const result = await fetchUserEnrollments({ userId, page, limit, status });

    res.status(200).json({
      success: true,
      data: result.enrollments,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalEnrollments: result.totalEnrollments,
        limit: result.limit
      }
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
      error: error.message
    });
  }
};