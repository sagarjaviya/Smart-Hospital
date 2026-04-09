const db = require('../config/db');

exports.registerPatient = async (req, res) => {
    const { name, email, password, phone, age } = req.body;

    try {
        // PostgreSQL uses $1, $2, etc. instead of ?
        await db.query(
            'INSERT INTO patients (name, email, password, phone, age) VALUES ($1, $2, $3, $4, $5)',
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
        // PostgreSQL: Use $1
        const results = await db.query('SELECT * FROM patients WHERE phone = $1', [phone]);

        // With 'pg' library, results are inside results.rows
        if (results.rows && results.rows.length > 0) {
            res.status(200).json({ 
                message: 'Login successful', 
                user: results.rows[0] 
            });
        } else {
            res.status(404).json({ message: 'Number not found' });
        }
    } catch (err) {
        console.error("LOGIN ERROR:", err.message);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.registerDoctor = async (req, res) => {
    const { name, email, password, specialization } = req.body;

    if (!name || !email || !password || !specialization) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // PostgreSQL: Use $1, $2, $3, $4
        await db.query(
            'INSERT INTO doctors (name, email, password, specialization) VALUES ($1, $2, $3, $4)',
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
        // PostgreSQL: Use $1, $2
        const results = await db.query(
            'SELECT * FROM doctors WHERE email = $1 AND password = $2', 
            [email, password]
        );

        if (results.rows && results.rows.length > 0) {
            res.status(200).json({ message: 'Login successful', doctor: results.rows[0] });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error("DOC LOGIN ERROR:", err.message);
        res.status(500).json({ error: 'Server error' });
    }
};
