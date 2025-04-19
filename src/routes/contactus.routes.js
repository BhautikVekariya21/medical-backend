import express from 'express';
import { getAllMessages, sendMessage } from '../controllers/contactus.controller.js';
import { isAdminAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/send', (req, res, next) => {
  console.log('📨 POST /contactus/send called');
  sendMessage(req, res, next);
});

router.get('/getall', isAdminAuthenticated, (req, res, next) => {
  console.log('📥 GET /contactus/getall called');
  getAllMessages(req, res, next);
});

export default router;