import express from 'express';
import {
  generateSummary,
  improveObjective,
  suggestSkills,
  rewriteProjectDescription,
  scoreResume,
} from '../controllers/aiController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all AI endpoints

router.post('/summary', generateSummary);
router.post('/objective', improveObjective);
router.post('/skills', suggestSkills);
router.post('/project-description', rewriteProjectDescription);
router.post('/resume-score', scoreResume);

export default router;
