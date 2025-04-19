import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config({ path: './.env' });

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRouter from './src/routes/user.routes.js';
import contactUsRouter from './src/routes/contactus.routes.js';
import appointmentRouter from './src/routes/appointment.routes.js';
import medicineRouter from './src/routes/medicine.routes.js';
import cartRouter from './src/routes/UserCart.routes.js';
import paymentRouter from './src/routes/payment.routes.js';
import testimonialRouter from './src/routes/testimonial.routes.js';

app.use('/api/v1/user', userRouter);
app.use('/api/v1/message', contactUsRouter);
app.use('/api/v1/appointment', appointmentRouter);
app.use('/api/v1/medicines', medicineRouter);
app.use('/api/v1/medicines-cart', cartRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/testimonial', testimonialRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
  }
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 400;
    err.message = 'Json Web Token is invalid, Try again!';
  }
  if (err.name === 'TokenExpiredError') {
    err.statusCode = 400;
    err.message = 'Json Web Token is expired, Try again!';
  }
  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = `Invalid ${err.path}`;
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(' ')
    : err.message;

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: errorMessage,
  });
});


// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', {
    message: error.message,
    statusCode: error.statusCode || 500,
    stack: error.stack,
  });
  if (!res.headersSent) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message || 'Server error',
    });
  }
});
// Global unhandled error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Do not exit; let nodemon handle restarts
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Do not exit
});

// At the end of app.js
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Do not exit; let nodemon handle restarts
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Do not exit
});

export default app;