import express from 'express'
import { approveApplication, getAllApplications, rejectApplication, submitApplication } from './instructorApplication.controller.js';
import {authenticateUser, requireAdmin} from '../../middleware/auth.middleware.js'

const router = express.Router();

router.post('/apply', authenticateUser, submitApplication);

// Admin routes
router.get('/applications', authenticateUser, requireAdmin, getAllApplications);
router.patch('/applications/:applicationId/approve', authenticateUser, requireAdmin, approveApplication);
router.patch('/applications/:applicationId/reject', authenticateUser, requireAdmin, rejectApplication);


export const instructorApplication = router;