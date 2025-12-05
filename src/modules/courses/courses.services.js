import { ObjectId } from "mongodb";
import {courseCollection} from "../../models/courses.js";


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
    const courses = courseCollection()
    const course = await courses.findOne({ 
      _id: new ObjectId(id), 
      status: 'published' 
    });

    return course;
  } catch (error) {
    throw new Error(`Error fetching course by ID: ${error.message}`);
  }
};

// / Fetch all courses with pagination and filters
export const fetchAllCourses = async ({ page, limit, category, level, search }) => {
  try {
    const skip = (page - 1) * limit;

    // Build query filter
    const filter = { status: 'published' };

    if (category) {
      filter.category = category;
    }

    if (level) {
      filter.level = level;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Fetch courses with pagination
    const coursesCollection = CourseCollection()
    const courses = await coursesCollection.find(filter)
  .project({ sections: 0, description: 0 }) // exclude fields
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .toArray(); // convert cursor to array

    // Get total count for pagination
    const totalCourses = await coursesCollection.countDocuments(filter);
    const totalPages = Math.ceil(totalCourses / limit);

    return {
      courses,
      currentPage: page,
      totalPages,
      totalCourses,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  } catch (error) {
    throw new Error(`Error fetching courses: ${error.message}`);
  }
};