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

// Fetch all enrollments for a user
export const fetchUserEnrollments = async ({ userId, page, limit, status }) => {
  const enrollmentStatistics = enrollmentCollection()
  try {
    const skip = (page - 1) * limit;

    const filter = { 'user.userId': userId };
    if (status) {
      filter.enrollmentStatus = status;
    }

    const enrollments = await enrollmentStatistics.find(filter)
      .sort({ enrollmentDate: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalEnrollments = await enrollmentStatistics.countDocuments(filter);
    const totalPages = Math.ceil(totalEnrollments / limit);

    return {
      enrollments,
      currentPage: page,
      totalPages,
      totalEnrollments,
      limit
    };
  } catch (error) {
    throw new Error(`Error fetching enrollments: ${error.message}`);
  }
};