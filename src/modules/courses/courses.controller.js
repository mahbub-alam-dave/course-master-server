import { fetchCourseById, fetchRandomCourses } from "./courses.services.js";

export const getRandomCourses = async (req, res) => {
  try {
    const courses = await fetchRandomCourses();
    
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching random courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch random courses',
      error: error.message
    });
  }
};

// Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await fetchCourseById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course details',
      error: error.message
    });
  }
};