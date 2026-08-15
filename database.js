const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'library.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err.message);
    else console.log('Connected to SQLite database.');
});

db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        is_admin BOOLEAN DEFAULT 0
    )`);

    // Upgraded Posts Table (Supports books, videos, articles, images, PDFs, text, links, and creator tracking)
    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        url TEXT,
        type TEXT DEFAULT 'Book',
        content TEXT,
        posted_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Default Admin Account
    const myAdminUsername = "AdminZubair";       
    const myAdminPassword = "SecurePassword123"; 

    db.get('SELECT * FROM users WHERE username = ?', [myAdminUsername], (err, user) => {
        if (!user) {
            const hash = bcrypt.hashSync(myAdminPassword, 10);
            db.run('INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)', 
                [myAdminUsername, hash, 1]);
            console.log(`✅ Admin account '${myAdminUsername}' created!`);
        }
    });
});

module.exports = db;