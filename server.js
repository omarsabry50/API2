require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Allows the server to accept JSON data in the request body
app.use(cors()); // Enables Cross-Origin Resource Sharing for the front-end

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully... 🚀'))
.catch(err => console.log('MongoDB connection error:', err));

// Define API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/users', require('./routes/user'));
app.use('/api/orders', require('./routes/order'));

// Simple root route to check if the server is running
app.get('/', (req, res) => res.send('E-Commerce API is running!'));

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));