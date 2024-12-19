const jwt = require('jsonwebtoken');
const config = require('config');


const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Access denied. Please log in.');
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        console.log('Decoded JWT:', decoded);  // Log the decoded JWT payload
        req.userid = decoded.id;  // Store the decoded user ID
        next();
    } catch (error) {
        res.status(400).send('Invalid token. Please log in again.');
    }
};

module.exports = auth;
