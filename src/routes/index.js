const productsController = require('../Controllers/products.controller');
const cartsController = require('../Controllers/carts.controller');
const chatController = require('../Controllers/chat.controller');

const router = app => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/products', productsController);
    app.use('/chat', chatController);
}

module.exports = router;