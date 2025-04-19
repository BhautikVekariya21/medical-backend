import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Busboy from 'busboy';

// Define the upload path
const uploadPath = path.join(process.cwd(), 'public', 'temp');

// Ensure the upload path exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type! Only JPEG, PNG, and WebP are allowed.'));
  }
  cb(null, true);
};

// Create multer instance
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

// Custom middleware to handle multer and busboy errors
export const safeUpload = (fieldName) => async (req, res, next) => {
  try {
    console.log('SafeUpload middleware called', {
      field: fieldName,
      headers: req.headers,
    });

    // Log raw request body for debugging
    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk.toString();
    });
    req.on('end', () => {
      console.log('Raw request body:', rawBody);
    });

    // Manually create busboy instance
    const busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: 10 * 1024 * 1024 },
    });

    // Track parsing success
    let parsingSuccessful = false;
    busboy.on('finish', () => {
      parsingSuccessful = true;
      console.log('Busboy parsing completed successfully');
    });

    // Handle busboy errors
    busboy.on('error', (err) => {
      console.error('Busboy error:', {
        message: err.message,
        stack: err.stack,
      });
      if (err.message === 'Unexpected end of form' && parsingSuccessful) {
        return; // Ignore non-critical error if parsing succeeded
      }
      if (!res.headersSent) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Invalid multipart form data. Please check the form structure.',
        });
      }
      // Do not call next() to prevent further execution
    });

    // Handle request errors
    req.on('error', (err) => {
      console.error('Request error in safeUpload:', {
        message: err.message,
        stack: err.stack,
      });
      if (!res.headersSent) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Invalid request data. Please check the form structure.',
        });
      }
    });

    // Wrap multer parsing in a Promise
    const multerMiddleware = upload.single(fieldName);
    await new Promise((resolve, reject) => {
      multerMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          console.error('Multer error:', {
            message: err.message,
            stack: err.stack,
          });
          return reject(Object.assign(err, { statusCode: 400 }));
        }
        if (err) {
          console.error('Upload error:', {
            message: err.message,
            stack: err.stack,
          });
          return reject(Object.assign(err, { statusCode: 400 }));
        }
        resolve();
      });
    });

    // Pipe request to busboy
    req.pipe(busboy);

    next();
  } catch (error) {
    console.error('Error in safeUpload:', {
      message: error.message,
      statusCode: error.statusCode || 400,
      stack: error.stack,
    });
    if (!res.headersSent) {
      res.status(error.statusCode || 400).json({
        success: false,
        statusCode: error.statusCode || 400,
        message: error.message || 'File upload failed',
      });
    }
  }
};