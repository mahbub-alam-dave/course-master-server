import express from "express"
import { getCourseById, getRandomCourses } from "./courses.controller.js";

const router = express.Router();

router.get("/random-courses", getRandomCourses)
router.get('/:id', getCourseById);

export const coursesRoutes = router;