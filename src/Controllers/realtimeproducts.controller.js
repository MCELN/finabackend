const { Router } = require('express');
const productsService = require('../Services/products.service');
const { environment } = require('../config');
const { authToken } = require('../utils/jwt.util');
const protectedRouteSession = require('../middlewares/protected-route');

const router = Router();

router.get('/', authToken, protectedRouteSession, async (req, res) => {
    try {
        const products = await productsService.getAll();
        if (environment === 'dotfs') {
            serializedMessages = await productsService.getAll();
        } else {
            serializedMessages = products.map(product => product.serialize());
        }

        res.render(
            'realtimeproducts',
            {
                serializedMessages,
                style: 'home.css',
            },
        );
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

module.exports = router;