const db = require('../config/db');
const nodemailer = require('nodemailer');

// 1. Setup Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sagar@gmail.com', // Your Gmail
        pass: 'Sagar@123'   // Your Google App Password
    }
});

// GET all pending appointments for the dashboard
exports.getPendingAppointments = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM appointments WHERE status IN ('Pending', 'Called') ORDER BY id ASC");
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.bookAppointment = async (req, res) => {
    // 1. Destructure the data coming from your frontend (appointment.html)
    const { patientName, doctor, date } = req.body;

    // 2. Generate the Token ID
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    const fullToken = "TKN-" + randomNumber;

    try {
        // 3. The Query - Ensure the column names match your MySQL table exactly
        const sqlQuery = `
            INSERT INTO appointments 
            (patient_name, doctor_id, appointment_date, token_number, status) 
            VALUES (?, ?, ?, ?, ?)
        `;

        // 4. The Values - 'Pending' matches your ENUM definition
        await db.query(sqlQuery, [patientName, doctor, date, fullToken, 'Pending']);

        // 5. Send success response back to the browser
        res.status(201).json({
            message: 'Appointment Booked Successfully!',
            token: fullToken
        });

    } catch (err) {
        // 6. IMPROVED ERROR LOGGING: This shows the exact SQL error in your VS Code terminal
        console.error("MySQL Insert Error:", err.message);

        res.status(500).json({
            error: 'Database Error: Could not save appointment.',
            details: err.message
        });
    }
};

// Function to notify patient when doctor calls them
// Function to notify patient - EMAIL/OTP DISABLED FOR NOW
exports.callNextPatient = async (req, res) => {
    const { tokenNumber } = req.body;
    try {
        // 1. Just check the appointments table directly
        const [results] = await db.query(
            "SELECT patient_name FROM appointments WHERE token_number = ?",
            [tokenNumber]
        );

        if (results.length > 0) {
            // 2. Update status to 'Called' without needing an email match
            await db.query(
                'UPDATE appointments SET status = "Called" WHERE token_number = ?',
                [tokenNumber]
            );

            // 3. Return success (OTP/Email is skipped for now)
            res.json({ message: "Patient status updated to Called!" });
        } else {
            res.status(404).json({ error: "Token not found in queue" });
        }
    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ error: "Server error updating status" });
    }
};
exports.getQueueStatus = async (req, res) => {
    const { token } = req.params;
    try {
        const [patient] = await db.query(
            "SELECT id, patient_name, doctor_id FROM appointments WHERE token_number = ?",
            [token]
        );

        if (patient.length === 0) return res.status(404).json({ error: "Token not found" });

        // Get the token number of the patient currently being called
        const [serving] = await db.query(
            "SELECT token_number FROM appointments WHERE status = 'Called' ORDER BY id ASC LIMIT 1"
        );

        const [ahead] = await db.query(
            "SELECT COUNT(*) as count FROM appointments WHERE status = 'Pending' AND id < ?",
            [patient[0].id]
        );

        res.json({
            patientsAhead: ahead[0].count,
            nowServing: serving.length > 0 ? serving[0].token_number : "Wait...",
            patient_name: patient[0].patient_name
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.completeAppointment = async (req, res) => {
    const { tokenNumber } = req.body;
    try {
        await db.query(
            "UPDATE appointments SET status = 'Completed' WHERE token_number = ?",
            [tokenNumber]
        );
        res.status(200).json({ message: "Appointment marked as completed" });
    } catch (err) {
        res.status(500).json({ error: "Database update failed" });
    }
};