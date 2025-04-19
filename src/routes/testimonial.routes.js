import express from 'express';
import { addNewTestimonial, getAllTestimonial } from '../controllers/testimonial.controller.js';

const router = express.Router();

router.post('/add', async (req, res, next) => {
 console.log('📝 POST /testimonial/add called');
 try {
 await addNewTestimonial(req, res, next);
 } catch (error) {
 if (!res.headersSent) {
 res.status(error.statusCode || 500).json({
 success: false,
 statusCode: error.statusCode || 500,
 message: error.message || 'Failed to add testimonial',
 });
 }
 }
});

router.get('/getall', async (req, res, next) => {
 console.log('📥 GET /testimonial/getall called');
 try {
 await getAllTestimonial(req, res, next);
 } catch (error) {
 if (!res.headersSent) {
 res.status(error.statusCode || 500).json({
 success: false,
 statusCode: error.statusCode || 500,
 message: error.message || 'Failed to fetch testimonials',
 });
 }
 }
});

export default router;