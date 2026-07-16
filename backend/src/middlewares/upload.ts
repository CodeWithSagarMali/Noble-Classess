import multer from 'multer';
import AppError from '../utils/appError';

// Configure memory storage to process file buffers directly
const storage = multer.memoryStorage();

// File size limits (e.g., 5MB max size)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    // Basic file type validation
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only JPEG, PNG, WEBP, PDF, and Excel sheets are allowed.', 400) as any, false);
    }
  },
});

export default upload;
