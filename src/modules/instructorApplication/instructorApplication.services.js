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