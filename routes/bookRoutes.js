const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload');

// Security Middleware to verify logged-in user
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Access denied" });
    const token = authHeader.split(' ')[1];
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// GET: Fetch all posts
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Upload a new resource with strict error handling
router.post('/', verifyToken, (req, res) => {
    upload.single('mediaFile')(req, res, async function (err) {
        if (err) {
            console.error("Cloudinary Upload Error:", err);
            return res.status(400).json({ error: "Cloudinary Error: " + err.message });
        }
        
        try {
            const { title, type, articleHtml } = req.body;
            let fileUrl = '';
            
            if (req.file) {
                fileUrl = req.file.path; 
            }

            const newPost = new Post({
                title,
                type,
                articleHtml,
                fileUrl,
                postedBy: req.user.username
            });

            await newPost.save();
            res.status(201).json(newPost);
        } catch (dbError) {
            console.error("Database Error:", dbError);
            res.status(500).json({ error: "Failed to save post to database." });
        }
    });
});

// PUT: Edit an existing resource
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title, type: req.body.type, articleHtml: req.body.articleHtml },
            { new: true }
        );
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: "Update failed on server." });
    }
});

// DELETE: Remove a resource
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed on server." });
    }
});

module.exports = router;