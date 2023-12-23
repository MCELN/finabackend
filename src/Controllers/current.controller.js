const { Router } = require('express');
const { authToken } = require('../utils/jwt.util');
const servicesUsers = require('../Services/users.service');
const formatDate = require('../utils/formattedDate.util');
const { sendPremiumUp } = require('../utils/send-mail.util');

const router = Router();

router.get('/profile', authToken, async (req, res) => {
    try {
        const response = await servicesUsers.getById(req.user._id);
        const user = response.serialize();
        user.createdAt = formatDate(user.createdAt);
        const showButton = user.role != 'admin' && user.role != 'premium';

        res.render('current-user',
            {
                user,
                showButton,
                style: 'home.css',
            },
        );
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.put('/:uid/premium', authToken, async (req, res) => {
    try {
        const response = await servicesUsers.updateOne(req.user._id, { role: 'premium' });
        const user = await servicesUsers.getById(req.params.uid);
        sendPremiumUp(user);
        res.status(200).json({ status: 'success', payload: user });
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

module.exports = router;