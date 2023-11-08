const { environment } = require('../config');

switch (environment) {
    case 'devfs':
        module.exports = {
            ProductsDao: require('../DAOs/fs/products.dao'),
        };
};

