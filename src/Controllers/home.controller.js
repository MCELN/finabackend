const { Router } = require('express');
const cookieExtractor = require('../utils/cookie-extractor.util');
const productsService = require('../Services/products.service');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const user = cookieExtractor(req);
        if (user) {
            return res.redirect('/api/products');
        }

        const response = await productsService.getAll();

        const serializedProducts = response.map(product => product.serialize());

        res.render(
            'home',
            {
                serializedProducts,
                style: 'home.css',
            }
        );
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
})

module.exports = router;