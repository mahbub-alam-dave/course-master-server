import { UserCollection } from "../../models/auth.js";
import {paymentsCollection} from '../../models/payment.js';
import {enrollmentCollection} from '../../models/enrollment.js';
import {courseCollection}  from '../../models/courses.js';

const getDateFilter = (dateRange) => {
  const now = new Date();
  let startDate;

  switch (dateRange) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      return {};
  }

  return { $gte: startDate };
};

const EnrollStatistics = enrollmentCollection();
const Payment = paymentsCollection();
const Course = courseCollection();

// Fetch dashboard overview stats (MongoDB Native)
export const fetchDashboardStats = async ({ dateRange, courseId }) => {
  try {
    const dateFilter = getDateFilter(dateRange);
    const courseFilter =
      courseId !== "all" ? { "course.courseId": courseId } : {};

    /* ---------------- TOTAL REVENUE ---------------- */
    const revenueResult = await Payment.aggregate([
      {
        $match: {
          status: "succeeded",
          ...(dateFilter.paymentDate && { paymentDate: dateFilter }),
          ...courseFilter,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]).toArray();

    const totalRevenue = revenueResult[0]?.total || 0;

    /* ---------------- TOTAL STUDENTS ---------------- */
const studentsResult = await EnrollStatistics.aggregate([
  {
    $match: {
      ...(dateFilter.enrollmentDate && { enrollmentDate: dateFilter }),
      ...courseFilter,
    },
  },
  { $group: { _id: "$user.userId" } },
  { $count: "totalStudents" },
]).toArray();

const totalStudents = studentsResult[0]?.totalStudents || 0;

    /* ---------------- TOTAL COURSES ---------------- */
    const totalCourses = await Course.countDocuments({
      status: "published",
    });

    /* ---------------- TOTAL INSTRUCTORS ---------------- */
const instructorsResult = await Course.aggregate([
  { $match: { status: "published" } },
  { $group: { _id: "$instructor.id" } },
  { $count: "totalInstructors" },
]).toArray();

const totalInstructors = instructorsResult[0]?.totalInstructors || 0;

    /* ---------------- TOTAL ENROLLMENTS ---------------- */
    const totalEnrollments = await EnrollStatistics.countDocuments({
      ...(dateFilter.enrollmentDate && { enrollmentDate: dateFilter }),
      ...courseFilter,
    });

    /* ---------------- AVERAGE COMPLETION RATE ---------------- */
    const completionResult = await EnrollStatistics.aggregate([
      {
        $match: {
          ...(dateFilter.enrollmentDate && { enrollmentDate: dateFilter }),
          ...courseFilter,
        },
      },
      {
        $group: {
          _id: null,
          avgCompletion: {
            $avg: "$progress.completionPercentage",
          },
        },
      },
    ]).toArray();

    const avgCourseCompletion = Math.round(
      completionResult[0]?.avgCompletion || 0
    );

    /* ---------------- REVENUE PER STUDENT ---------------- */
    const avgRevenuePerStudent =
      totalStudents > 0 ? totalRevenue / totalStudents : 0;

    /* ---------------- CHANGE VALUES (PLACEHOLDER) ---------------- */
    const revenueChange = 15;
    const studentsChange = 8;
    const coursesChange = 3;

    return {
      totalRevenue,
      totalStudents,
      totalCourses,
      totalInstructors,
      totalEnrollments,
      avgCourseCompletion,
      avgRevenuePerStudent,
      revenueChange,
      studentsChange,
      coursesChange,
    };
  } catch (error) {
    throw new Error(`Error fetching dashboard stats: ${error.message}`);
  }
};
