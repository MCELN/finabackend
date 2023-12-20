const { TicketsDao } = require('../adapters/factory');
const TicketsDto = require('../DTOs/ticket.dto');
const cartsService = require('../Services/carts.service');
const productsService = require('../Services/products.service');
const usersService = require('../Services/users.service');
const { sendTicket } = require('../utils/send-mail.util');

const Tickets = new TicketsDao();

const create = async (uid, ticketInfo) => {
    try {
        const user = await usersService.getById(uid);
        if (user) {
            const newTicket = {
                amount: ticketInfo.total,
                purchaser: user.email,
            };

            const ticket = new TicketsDto(newTicket);

            const response = await Tickets.create(ticket);

            sendTicket(user, ticketInfo);

            return response;
        };

        return 'El usuario no existe.';
    } catch (error) {
        throw error;
    };
};

const purchase = async (cid) => {
    try {
        const cart = await cartsService.getById(cid);
        const allProducts = await productsService.getAll();
        const notStock = [];
        const pay = [];
        const purchasedProducts = {
            products: [],
            total: 0,
        };

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

                purchasedProducts.total += product.subtotal;

                purchasedProducts.products.push(product);

                await cartsService.deleteOneProd(cid, prod.product._id.toString());
            });

            return purchasedProducts;
        }

        return null;

    } catch (error) {
        throw error;
    };
};

module.exports = {
    create,
    purchase,
};