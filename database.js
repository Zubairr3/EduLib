const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing! The .env variables did not load properly.");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Local MongoDB (Compass) Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1); // Stop the server from running if the DB fails
    }
};

module.exports = connectDB;