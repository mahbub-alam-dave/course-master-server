import { UserCollection } from "../../models/auth.js";
import {paymentsCollection} from '../../models/payment.js';
import {enrollmentCollection} from '../../models/enrollment.js';
import {courseCollection}  from '../../models/courses.js';

const getDateFilter = (dateRange) => {
  const now = new Date();
  let startDate;

  if (dateRange === "all") return null;

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
      return null;
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
          ...(dateFilter && { paymentDate: dateFilter }),
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
      ...(dateFilter && { enrollmentDate: dateFilter }),
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
      ...(dateFilter && { enrollmentDate: dateFilter }),
      ...courseFilter,
    });

    /* ---------------- AVERAGE COMPLETION RATE ---------------- */
    const completionResult = await EnrollStatistics.aggregate([
      {
        $match: {
          ...(dateFilter && { enrollmentDate: dateFilter }),
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

// recent enrollments
export const fetchRecentEnrollments = async (limit) => {
  try {
    const enrollments = await EnrollStatistics.find()
      .sort({ enrollmentDate: -1 })
      .limit(limit)
      .toArray();

    return enrollments;
  } catch (error) {
    throw new Error(`Error fetching recent enrollments: ${error.message}`);
  }
};

// Fetch top performing courses
export const fetchTopCourses = async (limit) => {
  try {
    const topCourses = await EnrollStatistics.aggregate([
      {
        $group: {
          _id: '$course.courseId',
          title: { $first: '$course.title' },
          enrollments: { $sum: 1 },
          totalRevenue: { $sum: '$payment.amount' },
          avgCompletion: { $avg: '$progress.completionPercentage' }
        }
      },
      {
        $sort: { enrollments: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 1,
          title: 1,
          enrollments: 1,
          revenue: '$totalRevenue',
          completionRate: { $round: ['$avgCompletion', 0] }
        }
      }
    ]).toArray();

    return topCourses;
  } catch (error) {
    throw new Error(`Error fetching top courses: ${error.message}`);
  }
};


// Fetch revenue chart data
export const fetchRevenueChart = async (dateRange) => {
  try {
    const Payment = paymentsCollection(); // native collection
    const dateFilter = getDateFilter(dateRange);

    let groupId = {};
    let sortStage = {};

    switch (dateRange) {
      case "week":
        // group by day
        groupId = {
          year: { $year: "$paymentDate" },
          month: { $month: "$paymentDate" },
          day: { $dayOfMonth: "$paymentDate" },
        };
        sortStage = {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        };
        break;

      case "month":
        // group by week
        groupId = {
          year: { $year: "$paymentDate" },
          week: { $week: "$paymentDate" },
        };
        sortStage = {
          "_id.year": 1,
          "_id.week": 1,
        };
        break;

      case "year":
        // group by month
        groupId = {
          year: { $year: "$paymentDate" },
          month: { $month: "$paymentDate" },
        };
        sortStage = {
          "_id.year": 1,
          "_id.month": 1,
        };
        break;

      default:
        groupId = {
          year: { $year: "$paymentDate" },
          month: { $month: "$paymentDate" },
        };
        sortStage = {
          "_id.year": 1,
          "_id.month": 1,
        };
    }

    const revenueData = await Payment.aggregate([
      {
        $match: {
          status: "succeeded",
          ...(dateFilter && { paymentDate: dateFilter }),
        },
      },
      {
        $group: {
          _id: groupId,
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: sortStage },
    ]).toArray();

    // ----- FORMAT FOR CHART -----
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const formattedData = revenueData.map((item) => {
      let label = "";

      if (item._id.day) {
        label = `${item._id.month}/${item._id.day}`;
      } else if (item._id.week) {
        label = `Week ${item._id.week}`;
      } else if (item._id.month) {
        label = months[item._id.month - 1];
      }

      return {
        label,
        revenue: item.revenue,
      };
    });

    return formattedData;
  } catch (error) {
    throw new Error(`Error fetching revenue chart: ${error.message}`);
  }
};

