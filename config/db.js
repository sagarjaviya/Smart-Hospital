const { Pool } = require('pg'); // Changed from mysql2 to pg
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool for PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432, // PostgreSQL default port
    ssl: {
        rejectUnauthorized: false // Required for Render connections
    }
});

// Export the query function to keep it compatible with your existing code
module.exports = {
    query: (text, params) => pool.query(text, params),
};
