import express from "express";
import {
  bookAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  getAllAppointments,
} from "../controllers/appointment.controller.js";
import {
  isPatientAuthenticated,
  isDoctorAuthenticated,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/book", isPatientAuthenticated, isDoctorAuthenticated, (req, res, next) => {
  console.log("📞 POST /appointment/book called");
  bookAppointment(req, res, next);
});

router.put("/update/:id", isDoctorAuthenticated, (req, res, next) => {
  console.log("✏️ PUT /appointment/update/:id called");
  updateAppointmentStatus(req, res, next);
});

router.delete("/delete/:id", isDoctorAuthenticated, (req, res, next) => {
  console.log("🗑️ DELETE /appointment/delete/:id called");
  deleteAppointment(req, res, next);
});

router.get("/getall", isDoctorAuthenticated, (req, res, next) => {
  console.log("📥 GET /appointment/getall called");
  getAllAppointments(req, res, next);
});

export default router;
