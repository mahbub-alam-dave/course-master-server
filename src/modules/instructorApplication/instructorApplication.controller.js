import { createApplication } from "./instructorApplication.services.js";

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