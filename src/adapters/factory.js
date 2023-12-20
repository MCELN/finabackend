const { environment } = require('../config');

switch (environment) {
    case 'devfs':
        module.exports = {
            ProductsDao: require('../DAOs/fs/products.dao'),
            CartsDao: require('../DAOs/fs/carts.dao'),
            ChatDao: require('../DAOs/fs/chat.dao'),
        };

        break;

    case 'devmongo':
        module.exports = {
            ProductsDao: require('../DAOs/mongodb/products.dao'),
            CartsDao: require('../DAOs/mongodb/carts.dao'),
            ChatDao: require('../DAOs/mongodb/chat.dao'),
            UsersDao: require('../DAOs/mongodb/users.dao'),
            TicketsDao: require('../DAOs/mongodb/tickets.dao'),
            winstonLog: require('../utils/winston/dev.winston'),
        };

        break;

    case 'prod':
        module.exports = {
            ProductsDao: require('../DAOs/mongodb/products.dao'),
            CartsDao: require('../DAOs/mongodb/carts.dao'),
            ChatDao: require('../DAOs/mongodb/chat.dao'),
            UsersDao: require('../DAOs/mongodb/users.dao'),
            TicketsDao: require('../DAOs/mongodb/tickets.dao'),
            winstonLog: require('../utils/winston/prod.winston'),
        };
};

