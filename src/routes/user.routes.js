import express from 'express';
import { patientRegister, getUserDetails, getDoctorDetails } from '../controllers/user.controller.js';
import { login, logoutAdmin, logoutDoctor, logoutPatient } from '../controllers/login_logout.controller.js';
import { addNewAdmin } from '../controllers/admin.controller.js';
import { addNewDoctor, getAllDoctors } from '../controllers/doctor.controller.js';
import { isAdminAuthenticated, isPatientAuthenticated, isDoctorAuthenticated } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js'; // Use the multer instance

const router = express.Router();

router.post('/patient/register', (req, res, next) => {
  console.log('📨 POST /patient/register called');
  patientRegister(req, res, next);
});

router.post('/login', (req, res, next) => {
  console.log('🔐 POST /login called');
  login(req, res, next);
});

router.post('/admin/addnew', isAdminAuthenticated, (req, res, next) => {
  console.log('👑 POST /admin/addnew called');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  addNewAdmin(req, res, next);
});

router.post('/doctor/addnew', isAdminAuthenticated, upload.single('docAvatar'), (req, res, next) => {
  console.log('🩺 POST /doctor/addnew called');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  addNewDoctor(req, res, next);
});

router.get('/alldoctors', (req, res, next) => {
  console.log('📚 GET /alldoctors called');
  getAllDoctors(req, res, next);
});

router.get('/admin/me', isAdminAuthenticated, (req, res, next) => {
  console.log('🧾 GET /admin/me called');
  getUserDetails(req, res, next);
});

router.get('/patient/me', isPatientAuthenticated, (req, res, next) => {
  console.log('🧾 GET /patient/me called');
  getUserDetails(req, res, next);
});

router.get('/doctor/me', isDoctorAuthenticated, (req, res, next) => {
  console.log('🧾 GET /doctor/me called');
  getDoctorDetails(req, res, next);
});

router.get('/admin/logout', isAdminAuthenticated, (req, res, next) => {
  console.log('🚪 GET /admin/logout called');
  logoutAdmin(req, res, next);
});

router.get('/doctor/logout', isDoctorAuthenticated, (req, res, next) => {
  console.log('🚪 GET /doctor/logout called');
  logoutDoctor(req, res, next);
});

router.get('/patient/logout', isPatientAuthenticated, (req, res, next) => {
  console.log('🚪 GET /patient/logout called');
  logoutPatient(req, res, next);
});

export default router;