const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors'); // 1. Import it at the top

// 2. Load Environment Variables
dotenv.config();

// 3. Initialize app FIRST (This fixes your ReferenceError)
const app = express(); 

// 4. Middlewares (Now you can use 'app')
app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 

// 5. Import and Use Routes
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api', appointmentRoutes);
app.use('/api/auth', authRoutes);

// 6. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ MVC Server is running!`);
    console.log(`🚀 Click here: http://localhost:${PORT}`);
});