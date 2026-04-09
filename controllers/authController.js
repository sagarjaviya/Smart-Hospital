const db = require('../config/db');

exports.registerPatient = async (req, res) => {
    // Make sure 'age' is included here!
    const { name, email, password, phone, age } = req.body;

    try {
        // Updated query to include age
        await db.query(
            'INSERT INTO patients (name, email, password, phone, age) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, phone, age]
        );
        res.status(201).json({ message: 'Patient registered successfully!' });
    } catch (err) {
        console.error("DATABASE ERROR:", err.message);
        res.status(500).json({ error: 'Database saving failed: ' + err.message });
    }
};

exports.loginPatient = async (req, res) => {
    const { phone } = req.body;
    try {
        // Find user by phone number
        const [results] = await db.query('SELECT * FROM patients WHERE phone = ?', [phone]);

        if (results.length > 0) {
            res.status(200).json({ 
                message: 'Login successful', 
                user: results[0] 
            });
        } else {
            res.status(404).json({ message: 'Number not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
};
// Add this to your authController.js
exports.registerDoctor = async (req, res) => {
    const { name, email, password, specialization } = req.body;

    // Check if any field is empty
    if (!name || !email || !password || !specialization) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await db.query(
            'INSERT INTO doctors (name, email, password, specialization) VALUES (?, ?, ?, ?)',
            [name, email, password, specialization]
        );
        res.status(201).json({ message: 'Doctor registered successfully!' });
    } catch (err) {
        console.error("DOCTOR REG ERROR:", err.message);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
};
exports.loginDoctor = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [results] = await db.query(
            'SELECT * FROM doctors WHERE email = ? AND password = ?', 
            [email, password]
        );
        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful', doctor: results[0] });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};