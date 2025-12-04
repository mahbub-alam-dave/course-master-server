import { checkUserEnrollment } from "./enrollment.services.js";

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