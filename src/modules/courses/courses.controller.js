import { fetchRandomCourses } from "./courses.services.js";

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