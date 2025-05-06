const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with detailed error logging
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected Successfully');
    console.log('Connection URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-auth');
})
.catch(err => {
    console.error('MongoDB Connection Error Details:', {
        name: err.name,
        message: err.message,
        code: err.code
    });
    process.exit(1); // Exit the process on connection failure
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/excel', require('./routes/excel'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 