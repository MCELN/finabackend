const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config');

const keyJwt = jwtKey;

const generateToken = (user) => {
    const token = jwt.sign({ user }, keyJwt, { expiresIn: 3600 });
    return token;
};

const authToken = (req, res, next) => {
    try {
        const token = req.cookies.authToken;

        if (!token) return res.status(401).redirect('/auth/login');

        jwt.verify(token, keyJwt, (error, credentials) => {
            if (error) return res.status(403).json({ status: 'error', error: 'Forbidden' });

            req.user = credentials.user;
            next();
        });
    } catch (error) {
        console.log({ error })
    }
};

module.exports = {
    generateToken,
    authToken,
};