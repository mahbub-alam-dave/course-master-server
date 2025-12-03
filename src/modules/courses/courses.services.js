import { CourseCollection } from "./courses.model.js";


export const fetchRandomCourses = async () => {
  try {
    const courses = CourseCollection()

    const randomCourses = await courses.aggregate([
      { $match: { status: 'published' } },
      { $sample: { size: 3 } }
    ]).toArray();

    return randomCourses;
  } catch (error) {
    throw new Error(`Error fetching random courses: ${error.message}`);
  }
};

// Fetch single course by ID
export const fetchCourseById = async (id) => {
  try {
    const courses = CourseCollection()
    const course = await courses.findOne({ 
      _id: id, 
      status: 'published' 
    }).lean();

    return course;
  } catch (error) {
    throw new Error(`Error fetching course by ID: ${error.message}`);
  }
};