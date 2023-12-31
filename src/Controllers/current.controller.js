const { Router } = require('express');
const mongoose = require('mongoose');
const { authToken } = require('../utils/jwt.util');
const usersService = require('../Services/users.service');
const productsService = require('../Services/products.service');
const formatDate = require('../utils/formattedDate.util');
const { sendPremiumUp } = require('../utils/send-mail.util');
const protectedRoutePremium = require('../middlewares/protected-route-premium');

const router = Router();

router.get('/profile', authToken, async (req, res) => {
    try {
        const response = await usersService.getById(req.user._id);
        const user = response.serialize();
        user.createdAt = formatDate(user.createdAt);
        const showButton = user.role != 'admin' && user.role != 'premium';
        const verified = user.verified && user.verified;

        res.render('current-user',
            {
                user,
                showButton,
                verified,
                style: 'home.css',
            },
        );
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.get('/create', authToken, protectedRoutePremium, async (req, res) => {
    try {
        const id = req.user._id;
        const filter = {
            createdBy: id,
        }
        const products = await productsService.getMany(filter);
        const serializedProducts = products.map(product => product.serialize());
        res.render('create-product-premium',
            {
                serializedProducts,
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
        const { uid } = req.params;
        await usersService.updateOne(uid, { role: 'premium' });
        const user = await usersService.getById(req.params.uid);
        sendPremiumUp(user);
        res.status(200).json({ status: 'success', payload: user });
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

module.exports = router;