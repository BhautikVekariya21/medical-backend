import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import app from './app.js';
import dbConnection from './src/db/dbConnection.js';

// Load environment variables
dotenv.config({
  path: './.env',
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database connection and server startup
dbConnection()
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`⚙️  Server is running at port: ${port} ⚙️`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// At the end of app.js or index.js
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', {
    message: err.message,
    stack: err.stack,
  });
  // Do not exit; let nodemon handle restarts
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', {
    message: err.message,
    stack: err.stack,
  });
  // Do not exit
});