const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        // Use existing connection
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
};

module.exports = connectDB;