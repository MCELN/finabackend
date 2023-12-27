const { Router } = require('express');
const mongoose = require('mongoose');
const { authToken } = require('../utils/jwt.util');
const usersService = require('../Services/users.service');
const productsService = require('../Services/products.service');
const formatDate = require('../utils/formattedDate.util');
const { sendPremiumUp } = require('../utils/send-mail.util');

const router = Router();

router.get('/profile', authToken, async (req, res) => {
    try {
        const response = await usersService.getById(req.user._id);
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

router.get('/create', authToken, async (req, res) => {
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
})

router.post('/create/product', authToken, async (req, res) => {
    try {
        const productInfo = req.body;
        const userInfo = req.user;
        productInfo.createdBy = userInfo._id;
        const response = await productsService.create(productInfo);
        res.status(201).json({ status: 'success', payload: response });
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
})

router.put('/:uid/premium', authToken, async (req, res) => {
    try {
        const { uid } = req.params;
        await usersService.updateOne(uid, { role: 'premium' });
        const user = await usersService.getById(req.params.uid);
        console.log(user);
        sendPremiumUp(user);
        res.status(200).json({ status: 'success', payload: user });
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

module.exports = router;