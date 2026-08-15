const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { SECRET } = require('../middleware/auth');
const router = express.Router();

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    
    db.run('INSERT INTO users (username, password, is_admin) VALUES (?, ?, 0)', 
        [username, hash], function(err) {
        if (err) return res.status(400).json({ error: 'Username already exists' });
        res.json({ success: 'User registered successfully' });
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, isAdmin: user.is_admin }, SECRET, { expiresIn: '24h' });
        res.json({ token, isAdmin: user.is_admin });
    });
});

module.exports = router;