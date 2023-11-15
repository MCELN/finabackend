const { Router } = require('express');
const userService = require('../Services/users.service');
const { comparePassword } = require('../utils/bcrypt.util');
const { generateToken } = require('../utils/jwt.util');

const router = Router();

router.get('/login', (req, res) => {
    try {
        res.render(
            'login',
            {
                style: 'home.css'
            }
        );
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.getOne(email);

        if (!user) {
            return res.status(400).json({ status: 'error', error: 'Invalid credentials' });
        }

        if (!comparePassword(password, user.password)) {
            return res.status(400).json({ status: 'error', error: 'Invalid credentials' });
        }

        req.user = {
            first_name: user.first_name,
            email: user.email,
            role: user.role,
        };

        const token = generateToken(user._id);

        res
            .cookie('authToken', token, { maxAge: 300000, httpOnly: true })
            .json({ status: 'success', payload: req.user, token });
    } catch (error) {
        console.log('login ' + error)
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

module.exports = router;