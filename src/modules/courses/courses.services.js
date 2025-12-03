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