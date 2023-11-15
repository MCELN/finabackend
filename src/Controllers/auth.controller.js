const { Router } = require('express');
const userService = require('../Services/users.service');
const { comparePassword } = require('../utils/bcrypt.util');
const { generateToken } = require('../utils/jwt.util');
const passport = require('passport');

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
        const user = await userService.getOne({ email });

        if (!user) {
            return res.status(400).json({ status: 'error', error: 'Invalid credentials' });
        }

        if (!comparePassword(password, user.password)) {
            return res.status(400).json({ status: 'error', error: 'Invalid credentials' });
        }

        req.user = {
            _id: user._id,
            first_name: user.first_name,
            email: user.email,
            role: user.role,
        };

        const token = generateToken(req.user);

        res
            .cookie('authToken', token, { maxAge: 300000, httpOnly: true })
            .json({ status: 'success', payload: req.user, token });
    } catch (error) {
        console.log('login ' + error)
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.get('/register', async (req, res) => {
    try {
        res.render(
            'register',
            {
                style: 'home.css'
            }
        );
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
})

router.post('/register',
    passport.authenticate('register', { session: false, failureRedirect: '/auth/register' }),
    async (req, res) => {
        try {
            const user = req.user;
            if (!user._id) {
                return res.status(401).json({ status: 'error', payload: user });
            }

            res.status(201).json({ status: 'success', payload: user });
        } catch (error) {
            res.status(500).json({ status: 'error', error: 'Internal error' });
        };
    },
);

router.get('/github',
    passport.authenticate('github', { scope: ['user: email'] }),
    async (req, res) => {

    });

router.get('/githubcallback',
    passport.authenticate('github', { failureRedirect: '/auth/login' }),
    (req, res) => {
        try {
            const user = req.user;
            if (user) {
                const token = generateToken(user._id);

                res
                    .cookie('authToken', token, { maxAge: 300000, httpOnly: true })
                    .json({ status: 'success', payload: req.user, token });
            } else {
                res.status(401).json({ status: 'error', payload: 'No se pudo iniciar sesión desde github' })
            };
        } catch (error) {
            res.status(500).json({ status: 'error', error: 'Internal error' });
        };
    },
);

module.exports = router;