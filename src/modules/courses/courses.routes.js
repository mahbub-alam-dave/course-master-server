import express from "express"
import { getRandomCourses } from "./courses.controller.js";

const router = express.Router();

router.get("/random-courses", getRandomCourses)


export const coursesRoutes = router;