const productsController = require('../Controllers/products.controller');
const cartsController = require('../Controllers/carts.controller');

const router = app => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/products', productsController);
}

module.exports = router;