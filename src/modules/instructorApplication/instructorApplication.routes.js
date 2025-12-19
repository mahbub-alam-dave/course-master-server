import express from 'express'
import { submitApplication } from './instructorApplication.controller.js';
import {authenticateUser} from '../../middleware/auth.middleware.js'

const router = express.Router();

router.post('/apply', authenticateUser, submitApplication);

export const instructorApplication = router;