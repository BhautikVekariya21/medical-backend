import { Appointment } from '../models/appointment.model.js';

// ✅ Book Appointment
export const bookAppointment = async (req, res, next) => {
  try {
    console.log('📩 Booking appointment...');

    const patientId = req.user;
    const doctorId = req.doctor;
    const { city, pincode, appointmentDate, department } = req.body;

    console.log('🔍 Received data:', { patientId, doctorId, city, pincode, appointmentDate, department });

    if (!city || !pincode || !appointmentDate || !department) {
      console.warn('⚠️ Missing required fields in appointment booking:', req.body);
      throw Object.assign(new Error('Please provide all required fields'), { statusCode: 400 });
    }

    const existedAppointment = await Appointment.findOne({
      patient: patientId,
      doctor: doctorId,
    });

    if (existedAppointment) {
      console.warn('❗ Appointment already exists:', existedAppointment);
      throw Object.assign(
        new Error('Your appointment was already booked. Please wait for any update!'),
        { statusCode: 400 }
      );
    }

    const createdAppointment = await Appointment.create({
      patient: patientId,
      patientFirstName: patientId.firstName,
      patientLastName: patientId.lastName,
      doctor: doctorId,
      doctorFirstName: doctorId.firstName,
      doctorLastName: doctorId.lastName,
      experience: doctorId.experience,
      appointmentCharges: doctorId.appointmentCharges,
      city,
      pincode,
      appointmentDate,
      department,
    });

    console.log('✅ Appointment created successfully:', createdAppointment);

    res.status(201).json({
      statusCode: 200,
      data: createdAppointment,
      message: 'Your Appointment Booked!',
    });
  } catch (error) {
    console.error('🚨 Error in bookAppointment:', error.message);
    next(error);
  }
};

// ✅ Update Appointment Status
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`🛠 Updating appointment with ID: ${id}`);

    let appointment = await Appointment.findById(id);
    if (!appointment) {
      console.warn(`❌ No appointment found with ID: ${id}`);
      throw Object.assign(new Error('Appointment not found'), { statusCode: 404 });
    }

    console.log('🔧 Current appointment data:', appointment);
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    console.log('✅ Appointment updated:', appointment);

    res.status(200).json({
      statusCode: 200,
      data: appointment,
      message: 'Appointment Status Updated!',
    });
  } catch (error) {
    console.error('🚨 Error in updateAppointmentStatus:', error.message);
    next(error);
  }
};

// ✅ Delete Appointment
export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`🗑 Deleting appointment with ID: ${id}`);

    let appointment = await Appointment.findById(id);
    if (!appointment) {
      console.warn(`❌ Appointment not found with ID: ${id}`);
      throw Object.assign(new Error('Appointment not found'), { statusCode: 404 });
    }

    await appointment.deleteOne();

    console.log('✅ Appointment deleted:', appointment);

    res.status(200).json({
      statusCode: 200,
      data: appointment,
      message: 'Appointment Successfully Deleted',
    });
  } catch (error) {
    console.error('🚨 Error in deleteAppointment:', error.message);
    next(error);
  }
};

// ✅ Get All Appointments
export const getAllAppointments = async (req, res, next) => {
  try {
    console.log('📄 Fetching all appointments...');

    const appointments = await Appointment.find();

    console.log(`📋 ${appointments.length} appointments found.`);

    res.status(200).json({
      statusCode: 200,
      data: appointments,
      message: 'All Appointments List',
    });
  } catch (error) {
    console.error('🚨 Error in getAllAppointments:', error.message);
    next(error);
  }
};
