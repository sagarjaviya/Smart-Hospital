const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Patient Routes
router.post('/register', authController.registerPatient);
// router.post('/login', authController.loginPatient);
router.post('/login-patient', authController.loginPatient);

// Doctor Routes (Ensure both are here)
router.post('/doctor-register', authController.registerDoctor);
router.post('/doctor-login', authController.loginDoctor); // Added this line

module.exports = router;