const express = require('express');
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
router.get('/users', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'Admins only' });

    db.all('SELECT id, username, is_admin FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;