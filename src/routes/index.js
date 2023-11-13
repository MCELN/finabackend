const productsController = require('../Controllers/products.controller');
const cartsController = require('../Controllers/carts.controller');
const chatController = require('../Controllers/chat.controller');
const rtpController = require('../Controllers/realtimeproducts.controller');

const router = app => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/products', productsController);
    app.use('/chat', chatController);
    app.use('/realtimeproducts', rtpController);
    app.use('/*', (req, res) => {
        try {
            res.render(
                'notfound',
                {
                    style: 'notfound.css',
                }
            )
        } catch (error) {
            res.status(500).json({ status: 'error', error: 'Internal error' })
        }
    })
}

module.exports = router;