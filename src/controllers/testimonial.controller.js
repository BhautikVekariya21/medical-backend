import { Testimonial } from '../models/testimonial.model.js';

// ✅ Add a New Testimonial
export const addNewTestimonial = async (req, res, next) => {
 try {
 console.log('📝 New testimonial submission received:', req.body);

 const { fullName, email, country, state, review } = req.body;

 // Validate required fields
 if (!fullName || !email || !country || !state || !review) {
 console.warn('⚠️ Missing fields in testimonial submission');
 throw Object.assign(new Error('Please fill all required fields!'), { statusCode: 400 });
 }

 // Create testimonial in MongoDB
 const createdTestimonial = await Testimonial.create({
 fullName,
 email,
 country,
 state,
 review,
 });

 console.log('✅ Testimonial created:', createdTestimonial._id);

 res.status(201).json({
 success: true,
 statusCode: 201,
 data: createdTestimonial,
 message: 'Testimonial created successfully',
 });
 } catch (error) {
 console.error('🚨 Error adding testimonial:', {
 message: error.message,
 statusCode: error.statusCode || 500,
 stack: error.stack,
 });
 next(error);
 }
};

// ✅ Get All Testimonials
export const getAllTestimonial = async (req, res, next) => {
 try {
 console.log('📥 Fetching all testimonials');
 const testimonials = await Testimonial.find();

 console.log(`✅ ${testimonials.length} testimonials fetched`);

 res.status(200).json({
 success: true,
 statusCode: 200,
 data: testimonials,
 message: 'Testimonials fetched successfully',
 });
 } catch (error) {
 console.error('🚨 Error fetching testimonials:', {
 message: error.message,
 statusCode: error.statusCode || 500,
 stack: error.stack,
 });
 next(error);
 }
};