const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// 1. FORCE Node.js to look for the .env file in the exact absolute directory
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

// --- 🔍 DIAGNOSTIC TRACKER ---
console.log("\n--- STARTING DIAGNOSTICS ---");
console.log("1. Looking for file at:", envPath);
console.log("2. Did Node.js find the file?", fs.existsSync(envPath) ? "✅ YES" : "❌ NO (File is missing or named wrong)");
console.log("3. Did it read the Variables?", process.env.MONGO_URI ? "✅ YES" : "❌ NO (File is empty or corrupted)");
console.log("----------------------------\n");

const connectDB = require('./database');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});