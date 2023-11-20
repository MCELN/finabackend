const { Router } = require('express');
const { authToken } = require('../utils/jwt.util');

const router = Router();

router.get('/', authToken, async (req, res) => {
    try {
        res.render('chat');
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

module.exports = router;