import { ContactUs } from '../models/contactus.model.js';
import { SMTPClient } from 'emailjs';
import { promisify } from 'util';

// Initialize emailjs SMTP client
const client = new SMTPClient({
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  tls: { ciphers: 'SSLv3' }, // Use TLS with fallback for compatibility
});

// Promisify the send method for async/await
const sendMailAsync = promisify(client.send).bind(client);

// ✅ Send Message
export const sendMessage = async (req, res, next) => {
  try {
    const { email, message } = req.body;
    console.log('📩 sendMessage called');
    console.log('📨 Incoming data:', { email, message });

    // Validate required fields
    if (!email || !message) {
      console.warn('⚠️ Email or message is missing');
      throw Object.assign(new Error('Please fill in the entire form!'), { statusCode: 400 });
    }

    // Save message to MongoDB
    const createdMessage = await ContactUs.create({ email, message });
    console.log('✅ Message saved to DB:', createdMessage._id);

    // Send email using emailjs
    const mailOptions = {
      from: email,
      to: process.env.SMTP_USER,
      subject: 'New Message from User: MediHub',
      text: message,
    };

    try {
      console.log('📧 Sending email with options:', mailOptions);
      const info = await sendMailAsync(mailOptions);
      console.log('✅ Email sent:', info);

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: createdMessage,
        message: 'Message and email sent successfully',
      });
    } catch (emailError) {
      console.warn('⚠️ Email sending failed:', emailError.message);
      // Return success since message was saved to DB
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: createdMessage,
        message: 'Message saved, but email sending failed',
      });
    }
  } catch (error) {
    console.error('🚨 Error in sendMessage:', {
      message: error.message,
      statusCode: error.statusCode || 500,
      stack: error.stack,
    });
    next(error);
  }
};

// ✅ Get All Messages
export const getAllMessages = async (req, res, next) => {
  try {
    console.log('📄 Fetching all contact messages...');
    const messages = await ContactUs.find();

    console.log(`📋 ${messages.length} messages found`);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: messages,
      message: 'All messages fetched successfully',
    });
  } catch (error) {
    console.error('🚨 Error in getAllMessages:', {
      message: error.message,
      statusCode: error.statusCode || 500,
      stack: error.stack,
    });
    next(error);
  }
};