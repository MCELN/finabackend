const { TicketsDao } = require('../adapters/factory');
const cartsService = require('../Services/carts.service');
const productsService = require('../Services/products.service');
const usersService = require('../Services/users.service');

const Tickets = new TicketsDao();

const purchase = async (cid, uid) => {
    try {
        const user = await usersService.getById(uid);
        const cart = await cartsService.getById(cid);
        const allProducts = await productsService.getAll();
        const notStock = [];
        const pay = [];
        const purchasedProducts = [];
        const total = {
            total: 0,
        }

        cart.products.forEach(async prod => {
            const product = allProducts.find(p => p._id.toString() === prod.product._id.toString());
            if (product && product.stock >= prod.quantity) {
                pay.push(prod);
                await productsService.updateOne(product._id, { stock: (product.stock - prod.quantity) })
            } else if (product) {
                notStock.push(prod);
            }
        });


        if (pay.length > 0) {
            pay.forEach(async prod => {
                const product = {
                    title: prod.product.title,
                    price: prod.product.price,
                    quantity: prod.quantity,
                    subtotal: prod.product.price * prod.quantity,
                };

                total.total += product.subtotal;

                purchasedProducts.push(product);

                await cartsService.deleteOneProd(cid, prod.product._id.toString());
            });
            purchasedProducts.push(total);
        }

    } catch (error) {
        throw error;
    };
};

module.exports = {
    purchase,
};