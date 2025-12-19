import express from 'express'
import { getAllApplications, submitApplication } from './instructorApplication.controller.js';
import {authenticateUser, requireAdmin} from '../../middleware/auth.middleware.js'

const router = express.Router();

router.post('/apply', authenticateUser, submitApplication);

// Admin routes
router.get('/applications', authenticateUser, requireAdmin, getAllApplications);


export const instructorApplication = router;