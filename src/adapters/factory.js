const { environment } = require('../config');

switch (environment) {
    case 'devfs':
        module.exports = {
            ProductsDao: require('../DAOs/fs/products.dao'),
            CartsDao: require('../DAOs/fs/carts.dao'),
        };

        break;

    case 'devmongo':
        module.exports = {
            ProductsDao: require('../DAOs/mongodb/products.dao'),
            CartsDao: require('../DAOs/mongodb/carts.dao')
        };

        break;
};

