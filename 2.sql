USE hospital_db;

-- Clear old test data to prevent "Email already exists" errors
DELETE FROM patients WHERE email = 'patient@test.com';
DELETE FROM doctors WHERE email = 'doctor@test.com';

-- Add a test Patient (Password is 'password123')
INSERT INTO patients (name, email, password, phone) 
VALUES ('John Doe', 'patient@test.com', 'password123', '1234567890');

-- Add a test Doctor (Password is 'doc123')
INSERT INTO doctors (name, email, password, specialization) 
VALUES ('Dr. Smith', 'doctor@test.com', 'doc123', 'Cardiology');