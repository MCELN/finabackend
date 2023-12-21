const { Router } = require('express');
const protectedRouteAdmin = require('../middlewares/protected-route');
const usersService = require('../Services/users.service');
const { authToken } = require('../utils/jwt.util');

const router = Router();

router.get('/', async (req, res) => {
    try {

        const users = await usersService.getAll();
        console.log(users);
        res.render('users', users);
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
})

router.delete('/', protectedRouteAdmin, async (req, res) => {
    try {
        const deleted = await usersService.deleteMany();
        res.json({ status: 'success', deleted });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
})

module.exports = router;