import express from "express"
import { authController } from "./auth.controller.js";
const router = express.Router();


router.post("/register", authController.register)
router.post("/login", authController.login)

// social login
router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleCallback);

router.get("/github", authController.githubAuth);
router.get("/github/callback", authController.githubCallback);

export const authRoutes = router;
