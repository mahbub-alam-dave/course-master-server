import express from "express"
import { getAllCourses, getCourseById, getRandomCourses } from "./courses.controller.js";

const router = express.Router();

router.get("/random-courses", getRandomCourses)
router.get('/:id', getCourseById);
router.get('/', getAllCourses);

export const coursesRoutes = router;