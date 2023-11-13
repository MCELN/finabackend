const { Router } = require('express');
const productsService = require('../Services/products.service');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productsService.getAll();
        const serializedMessages = products.map(product => product.serialize());

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