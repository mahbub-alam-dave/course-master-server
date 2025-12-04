import { enrollmentCollection } from "./enrollment.model";

// Check if user is enrolled in a course
export const checkUserEnrollment = async (userId, courseId) => {
  try {
    const enrollmentStatistics = enrollmentCollection()
    const enrollment = await enrollmentStatistics.findOne({
      'user.userId': userId,
      'course.courseId': courseId,
      enrollmentStatus: 'active'
    });

    return !!enrollment;
  } catch (error) {
    throw new Error(`Error checking enrollment: ${error.message}`);
  }
};