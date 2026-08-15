const jwt = require('jsonwebtoken');
const SECRET = 'super_secret_library_key_2026';

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token.split(' ')[1], SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}
module.exports = { authenticateToken, SECRET };