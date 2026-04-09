USE hospital_db;

-- 1. Update Patients Table (Adding 'age' and removing strict email constraints for testing)
DROP TABLE IF EXISTS patients;
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),          -- Removed UNIQUE for easier testing
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(10) NOT NULL,  -- Fixed to 10 digits
    age INT                      -- Added the missing Age column
);

-- 2. Doctors Table (Keep this as is)
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialization VARCHAR(100)
);

-- 3. Appointments Table (Matches your TKN logic)
-- This cleans the table and sets it up exactly as the code expects
DROP TABLE IF EXISTS appointments;

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    doctor_id VARCHAR(255) NOT NULL,
    appointment_date VARCHAR(255) NOT NULL,
    token_number VARCHAR(100) NOT NULL,
    status ENUM('Pending', 'Called', 'Completed', 'Cancelled') DEFAULT 'Pending'
);