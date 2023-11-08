const productsController = require('../Controllers/products.controller');

const router = app => {
    app.use('/api/products', productsController);
}

module.exports = router;