const { Router } = require('express');
const cartService = require('../Services/carts.service');
const ticketsService = require('../Services/tickets.service');
const usersService = require('../Services/users.service');
const { authToken } = require('../utils/jwt.util');
const protectedRouteCart = require('../middlewares/protected-route-cart');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await cartService.getAll();
        res.json({ status: 'success', payload: carts });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.get('/:cid', authToken, protectedRouteCart, async (req, res) => {
    try {
        const { cid } = req.params;
        const cartProducts = await cartService.getByIdForHandlebars(cid);
        const products = cartProducts.products;
        const flag = (products.length > 0);



        res.render(
            'cart',
            {
                flag,
                products,
                cid,
                style: "home.css",
            });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.post('/', async (req, res) => {
    try {
        const response = await cartService.create();
        res.status(201).json({ status: 'success', payload: response });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.put('/:cid/products/:pid', authToken, protectedRouteCart, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const qty = req.body.quantity;
        const response = await cartService.updateOne(cid, pid, qty);

        if (response === 400) return res.status(400).json({ status: 'error', message: 'Bad request' });
        if (response === 'notstock') return res.json({ status: 'success', message: 'notstock' });

        res.status(201).json({ status: 'succes', payload: response });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.post('/:cid/purchase', authToken, protectedRouteCart, async (req, res) => {
    try {
        const { cid } = req.params;
        const { _id } = req.user;
        const dataTicket = await ticketsService.purchase(cid);
        const ticket = await ticketsService.create(_id, dataTicket);
        res.json({ status: 'success', payload: ticket })
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const response = await cartService.deleteOneProd(cid, pid);
        if (response === 401) return res.status(401).json({ status: 'error', payload: 'Bad Request' });
        res.json({ status: 'success', payload: response })
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.delete('/:cid/products', async (req, res) => {
    try {
        const { cid } = req.params;
        const response = await cartService.deleteAllProd(cid);
        res.status(201).json({ status: 'success', payload: response });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

module.exports = router;