import fs from 'fs';
import { parseResumeFile } from '../utils/resumeParser.js';

/**
 * Controller to handle resume upload and parsing.
 * Extracts text from the uploaded PDF or DOCX file, parses it, and deletes the temporary file.
 */
export const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded or invalid file type. Please upload a PDF or DOCX file.'
    });
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;

  try {
    const parsedData = await parseResumeFile(filePath, mimeType, req.file.originalname);
    
    return res.status(200).json({
      success: true,
      message: 'Resume imported successfully',
      resumeData: parsedData
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume file.'
    });
  } finally {
    // Always clean up the temporary file after parsing
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error('Error deleting uploaded file:', cleanupError);
    }
  }
};

export default uploadResume;
