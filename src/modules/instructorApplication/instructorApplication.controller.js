import { createApplication, fetchAllApplications } from "./instructorApplication.services.js";

// Submit instructor application
export const submitApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name;
    const userEmail = req.user.email;
    const applicationData = req.body;

    // Check if user is already an instructor
    if (req.user.role === 'instructor') {
      return res.status(400).json({
        success: false,
        message: 'You are already an instructor'
      });
    }

    const application = await createApplication({
      userId,
      userName,
      userEmail,
      applicationData
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will review it soon.',
      data: application
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all applications (Admin)
export const getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'all';

    const result = await fetchAllApplications({ page, limit, status });

    res.status(200).json({
      success: true,
      data: result.applications,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalApplications: result.totalApplications,
        limit: result.limit
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

// Approve application (Admin)
export const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const adminId = req.user.id;
    const adminName = req.user.name;

    const result = await approveInstructorApplication({
      applicationId,
      adminId,
      adminName
    });

    res.status(200).json({
      success: true,
      message: 'Application approved successfully! User is now an instructor.',
      data: result
    });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Reject application (Admin)
export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;
    const adminName = req.user.name;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const application = await rejectInstructorApplication({
      applicationId,
      adminId,
      adminName,
      reason
    });

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      data: application
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
