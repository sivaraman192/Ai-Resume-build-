import express from 'express';
import multer from 'multer';
import fs from 'fs';
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  restoreVersion,
} from '../controllers/resumeController.js';
import uploadResume from '../controllers/uploadResumeController.js';
import protect from '../middleware/authMiddleware.js';

// Ensure uploads directory exists inside server folder
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Multer file filter to accept PDF and DOCX only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = express.Router();

router.use(protect); // Secure all resume endpoints

// Resume upload endpoint with custom error handling for multer
router.post('/upload', (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, uploadResume);

router.route('/')
  .post(createResume)
  .get(getResumes);

router.route('/:id')
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

router.route('/:id/restore')
  .post(restoreVersion);

export default router;
