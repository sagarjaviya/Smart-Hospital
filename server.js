const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/db'); // 1. Import your database connection

dotenv.config();

const app = express(); 

// 2. Database Initialization Script (This builds your tables automatically)
const initDb = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS doctors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                specialization VARCHAR(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS patients (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20) UNIQUE NOT NULL,
                age INT
            );
        `);
        console.log("✅ Database tables are verified and ready!");
    } catch (err) {
        console.error("❌ Database Init Error:", err.message);
    }
};
initDb();

app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 

const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api', appointmentRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ MVC Server is running!`);
    console.log(`🚀 Click here: http://localhost:${PORT}`);
});
