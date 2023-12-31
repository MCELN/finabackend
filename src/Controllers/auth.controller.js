const { Router } = require('express');
const { domain } = require('../config');
const { v4: uuidv4 } = require('uuid');
const userService = require('../Services/users.service');
const { comparePassword } = require('../utils/bcrypt.util');
const { generateToken, authToken } = require('../utils/jwt.util');
const passport = require('passport');
const { sendVerifyMail } = require('../utils/send-mail.util');
const protectedRouteLogin = require('../middlewares/protected-route-login');
const validateEmail = require('../utils/validate-email.util');

const router = Router();

router.get('/login', protectedRouteLogin, (req, res) => {
    try {
        res.render(
            'login',
            {
                style: 'home.css'
            }
        );
    } catch (error) {
        req.logger.error(error);
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
        };

        const token = generateToken(req.user);

        res
            .cookie('authToken', token, { maxAge: 3600000, httpOnly: true })
            .json({ status: 'success', payload: req.user, token });
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.get('/register', protectedRouteLogin, async (req, res) => {
    try {
        res.render(
            'register',
            {
                style: 'home.css'
            }
        );
    } catch (error) {
        req.logger.error(error);
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
            req.logger.error(error);
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
            req.logger.error(error);
            res.status(500).json({ status: 'error', error: 'Internal error' });
        };
    },
);

router.put('/recover-password', async (req, res) => {
    try {
        const email = req.body.email;
        if (!validateEmail(email)) {
            return res.status(404).json({ status: 'error', message: 'notIsMail' });
        }
        const user = await userService.getOne({ email });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'notFound' });
        }

        await userService.recoverPasswordLink(user)

        res.json({ status: 'success', message: 'ok' });
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
})

router.get('/recover-password/:uid/:linkRecover', async (req, res) => {
    try {
        const { uid, linkRecover } = req.params;
        const deprecate = await userService.isValidateLink(uid, linkRecover);

        res.render(
            'recover-password',
            {
                style: 'home.css',
                deprecate,
                uid,
            }
        )

    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
})

router.put('/change-password/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const { password, rePassword } = req.body;
        const response = await userService.changePassword(uid, password, rePassword);
        res.status(201).json({ status: 'success', message: response });
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
})

router.put('/verify/:uid/resend', authToken, async (req, res) => {
    try {
        const { uid } = req.params;
        const generateNewVerify = uuidv4();
        await userService.updateOne({ _id: uid }, { verify: generateNewVerify });
        const user = await userService.getById(uid);

        const verifyLink = `${domain}/auth/verify/${user.email}/${user.verify}`;

        sendVerifyMail(user, verifyLink);

        res.status(201).json({ status: 'success', message: 'Verificación reenviada' });

    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.get('/verify/:email/:verify', async (req, res) => {
    try {
        const { email, verify } = req.params;

        if (!email || !verify) {
            req.logger.warning('Intento de verificación sin parámetros.');
            return res.redirect('/api/products');
        }

        const response = await userService.verifyMail(email, verify);

        if (response === 'not found') {
            req.logger.error('Error en la verificación del correo');
            return res.redirect('/api/products');
        } else if (response === 'Cuenta verificada') {
            req.logger.info('Cuenta verificada');
            return res.redirect('/api/products');
        }
        const user = await userService.getOne({ email });

        const { first_name, last_name } = user;

        if (!response) {
            req.logger.warning('Intento de verificación de correo no verificado');
            return res.status(400).json({ status: 'error', error: 'Invalid credentials' });
        }
        res.render(
            'verify',
            {
                first_name,
                last_name,
                style: 'home.css',

            },
        );
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
})

router.delete('/logout', async (req, res) => {
    try {
        res.clearCookie('authToken');
        req.user = null;
        res.status(200).json({ status: 'success', message: 'Logout successful' });
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

module.exports = router;