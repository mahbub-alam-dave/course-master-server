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


// / Update course progress
export const updateCourseProgress = async ({ enrollmentId, userId, progressData }) => {
  const enrollmentStatistics = enrollmentCollection();

  try {
    // Convert enrollmentId to ObjectId
    const _id = new ObjectId(enrollmentId);

    // Get the existing enrollment document
    const enrollment = await enrollmentStatistics.findOne({
      _id,
      'user.userId': userId
    });

    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    // Prepare update object
    const updateFields = {};

    // Update completed lectures
    if (progressData.completedLectures !== undefined) {
      updateFields['progress.completedLectures'] = progressData.completedLectures;
    }

    // Push completed section
    const updateOperators = {};
    if (progressData.completedSections) {
      updateOperators.$push = {
        'progress.completedSections': {
          sectionId: progressData.completedSections.sectionId,
          completedDate: new Date(),
        }
      };
    }

    // Recalculate completion percentage
    const totalLectures = enrollment.progress.totalLectures || 0;
    const completedLectures = progressData.completedLectures ?? enrollment.progress.completedLectures;

    if (totalLectures > 0) {
      updateFields['progress.completionPercentage'] = Math.round((completedLectures / totalLectures) * 100);
    }

    updateFields['progress.lastAccessedDate'] = new Date();

    // Course completion check
    if (updateFields['progress.completionPercentage'] === 100) {
      updateFields['enrollmentStatus'] = 'completed';
    }

    // Apply update
    await enrollmentStatistics.updateOne(
      { _id },
      {
        $set: updateFields,
        ...(updateOperators.$push ? { $push: updateOperators.$push } : {})
      }
    );

    // Return updated document
    const updatedEnrollment = await enrollmentStatistics.findOne({ _id });
    return updatedEnrollment;

  } catch (error) {
    throw new Error(`Error updating progress: ${error.message}`);
  }
};
