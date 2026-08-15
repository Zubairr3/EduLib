const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all posts (Searchable)
router.get('/', authenticateToken, (req, res) => {
    const { query } = req.query;
    let sql = 'SELECT * FROM posts';
    let params = [];

    if (query) {
        sql += ' WHERE title LIKE ? OR author LIKE ? OR posted_by LIKE ? OR type LIKE ?';
        params = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];
    }
    sql += ' ORDER BY id DESC';

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create a post (Available to BOTH Users and Admins)
router.post('/', authenticateToken, (req, res) => {
    const { title, author, url, type, content } = req.body;
    
    db.get('SELECT username FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err || !user) return res.status(403).json({ error: 'User not found' });

        const postedBy = user.username;

        db.run('INSERT INTO posts (title, author, url, type, content, posted_by) VALUES (?, ?, ?, ?, ?, ?)', 
            [title || 'Untitled', author || 'Anonymous', url || '', type || 'Book', content || '', postedBy], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: 'Resource posted successfully', id: this.lastID });
        });
    });
});

// Admin Only: Get all registered users
 // Make sure bcrypt is required at the top if not already

// Admin Only: Get all registered users
router.get('/users', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'Admins only' });

    db.all('SELECT id, username, is_admin FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Admin Only: Manually update/reset a user's password
router.put('/users/:id/password', authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const userId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.trim() === '') {
        return res.status(400).json({ error: 'New password cannot be empty' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'User not found' });

            res.json({ success: 'User password updated successfully by admin' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error while hashing password' });
    }
});

module.exports = router;