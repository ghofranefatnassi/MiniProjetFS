const config = require("config");
const jwt = require('jsonwebtoken');

// Middleware to check for valid JWT token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Access denied. Please log in.');
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.userid = decoded.id;
        next();
    } catch (ex) {
        res.status(400).send('Token not valid, please log in again.');
    }
};

module.exports = auth;
