import express from "express"
import { authController } from "./auth.controller";
const router = express.Router();


router.push("/register", authController.registerUser)