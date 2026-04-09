const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Check line 6 specifically - make sure the function name is correct!
router.get('/appointments/all', appointmentController.getPendingAppointments); 
router.get('/queue-status/:token', appointmentController.getQueueStatus);

router.post('/book', appointmentController.bookAppointment);
router.post('/call-next', appointmentController.callNextPatient);
router.post('/complete-appointment', appointmentController.completeAppointment);

module.exports = router;