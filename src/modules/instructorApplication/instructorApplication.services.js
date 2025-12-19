import { instructorApplicationCollection } from "../../models/application.js";

const InstructorApplication = instructorApplicationCollection();

export const createApplication = async ({
  userId,
  userName,
  userEmail,
  applicationData
}) => {
  try {
    // Check if application already exists
    const existingApplication = await InstructorApplication.findOne({
      'user.userId': userId
    });

    if (existingApplication) {
      if (existingApplication.status === 'pending') {
        throw new Error('You already have a pending application');
      }
      if (existingApplication.status === 'approved') {
        throw new Error('Your application has already been approved');
      }
      // If rejected, allow reapplication by updating existing one
      existingApplication.bio = applicationData.bio;
      existingApplication.title = applicationData.title;
      existingApplication.expertise = applicationData.expertise;
      existingApplication.experience = applicationData.experience;
      existingApplication.teachingExperience = applicationData.teachingExperience;
      existingApplication.socialLinks = applicationData.socialLinks;
      existingApplication.motivation = applicationData.motivation;
      existingApplication.courseIdeas = applicationData.courseIdeas;
      existingApplication.status = 'pending';
      existingApplication.appliedDate = new Date();
      existingApplication.rejectionReason = undefined;
      
      await existingApplication.save();
      return existingApplication;
    }

    // Create new application
    const application = await InstructorApplication.create({
      user: {
        userId,
        name: userName,
        email: userEmail
      },
      bio: applicationData.bio,
      title: applicationData.title,
      expertise: applicationData.expertise,
      experience: applicationData.experience,
      teachingExperience: applicationData.teachingExperience,
      socialLinks: applicationData.socialLinks || {},
      motivation: applicationData.motivation,
      courseIdeas: applicationData.courseIdeas,
      status: 'pending'
    });

    return application;
  } catch (error) {
    throw new Error(`Error creating application: ${error.message}`);
  }
};



// Fetch all applications
export const fetchAllApplications = async ({ page, limit, status }) => {
  try {
    const skip = (page - 1) * limit;
    
    const filter = status !== 'all' ? { status } : {};

    const applications = await InstructorApplication.find(filter)
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalApplications = await InstructorApplication.countDocuments(filter);
    const totalPages = Math.ceil(totalApplications / limit);

    return {
      applications,
      currentPage: page,
      totalPages,
      totalApplications,
      limit
    };
  } catch (error) {
    throw new Error(`Error fetching applications: ${error.message}`);
  }
};


// Approve application
export const approveInstructorApplication = async ({
  applicationId,
  adminId,
  adminName
}) => {
  try {
    const application = await InstructorApplication.findById(applicationId);

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.status === 'approved') {
      throw new Error('Application has already been approved');
    }

    // Generate instructor ID
    const instructorId = `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update user role and add instructor details
    await User.findByIdAndUpdate(application.user.userId, {
      role: 'instructor',
      instructorId: instructorId,
      instructorProfile: {
        bio: application.bio,
        title: application.title,
        expertise: application.expertise,
        socialLinks: application.socialLinks
      }
    });

    // Update application status
    application.status = 'approved';
    application.reviewedBy = {
      adminId,
      adminName,
      reviewDate: new Date()
    };
    await application.save();

    return {
      application,
      instructorId
    };
  } catch (error) {
    throw new Error(`Error approving application: ${error.message}`);
  }
};


// Reject application
export const rejectInstructorApplication = async ({
  applicationId,
  adminId,
  adminName,
  reason
}) => {
  try {
    const application = await InstructorApplication.findByIdAndUpdate(
      applicationId,
      {
        status: 'rejected',
        rejectionReason: reason,
        reviewedBy: {
          adminId,
          adminName,
          reviewDate: new Date()
        }
      },
      { new: true }
    );

    if (!application) {
      throw new Error('Application not found');
    }

    return application;
  } catch (error) {
    throw new Error(`Error rejecting application: ${error.message}`);
  }
};