import { ObjectId } from "mongodb";
import {enrollmentCollection}  from "../../models/enrollment.js";


// Check if user is enrolled in a course
export const checkUserEnrollment = async (userId, courseId) => {
  try {
    const enrollmentStatistics = enrollmentCollection()
    const enrollment = await enrollmentStatistics.findOne({
      'user.userId': userId,
      'course.courseId': new ObjectId(courseId),
      enrollmentStatus: 'active'
    });

    return !!enrollment;
  } catch (error) {
    throw new Error(`Error checking enrollment: ${error.message}`);
  }
};