const { Router } = require('express');
const productsService = require('../Services/products.service');
const cartService = require('../Services/carts.service');
const userService = require('../Services/users.service');
const { isValidObjectId } = require('mongoose');
const { authToken } = require('../utils/jwt.util');

const router = Router();

router.get('/', authToken, async (req, res) => {
    try {
        const user = await userService.getByIdForHandlebars(req.user._id);
        const cart = await cartService.getById(user.cart)
        const userAdmin = user && user.role === 'admin';
        const userUser = user && user.role === 'user';
        const cid = cart && cart._id;
        const verified = user.verified;

        const { limit = 10, page = 1, sort, query } = req.query;

        let filter = {};

        if (query) {
            if (query === 'false' || query === 'true') {
                filter = { status: query }
            } else {
                filter = { category: query };
            };
        };

        const sortO = {};

        if (sort === 'asc') {
            sortO.price = 1;
        } else if (sort === 'desc') {
            sortO.price = -1;
        };

        const queryOption = {
            limit,
            page,
            sort: sortO,
        };

        const products = await productsService.paginate(filter, queryOption);

        const prod = products.docs;

        const serializedMessages = prod.map(product => product.serialize());


        const { prevPage, nextPage, hasPrevPage, hasNextPage } = products;


        const prevLink = hasPrevPage ? `/products?limit=${limit}&page=${prevPage}${sort ? "&sort=" + sort : ""}${query ? "&query=" + query : ""}` : null;
        const nextLink = hasNextPage ? `/products?limit=${limit}&page=${nextPage}${sort ? "&sort=" + sort : ""}${query ? "&query=" + query : ""}` : null;


        res.render(
            'products',
            {
                serializedMessages,
                verified,
                cid,
                prevLink,
                nextLink,
                user,
                userAdmin,
                userUser,
                style: 'home.css',
            },
        );

    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        if (!isValidObjectId(pid)) {
            req.logger.error('El id no es válido');
            res.status(401).json({ status: 'error', message: 'El id no es válido.' });
            return
        };

        const product = await productsService.getById(pid);

        if (!product) {
            req.logger.warning('El producto no existe');
            res.status(401).json({ status: 'error', message: 'El producto no existe.' });
            return
        };
        res.json({ status: 'success', payload: product });
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.post('/', async (req, res) => {
    try {
        const productInfo = req.body;
        const newProduct = await productsService.create(productInfo);
        if (newProduct === 'code') {
            res.status(401).json({ status: 'error', message: 'El código del producto ya existe.' });
        } else if (newProduct === 'campos') {
            res.status(401).json({ status: 'error', message: 'Faltan campos obligatorios.' });
        } else {
            res.status(201).json({ status: 'success', payload: newProduct });
        };
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        if (req.body.stock) req.body.stock = parseInt(req.body.stock);
        if (req.body.price) req.body.price = parseInt(req.body.price);
        const productUp = await productsService.updateOne(pid, req.body);
        res.status(201).json({ status: 'success', payload: productUp });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const response = await productsService.deleteOne(pid);
        if (response === 200) {
            res.json({ status: 'success' });
        } else {
            res.status(204).json({ status: 'error', message: 'El producto que desea eliminar no existe.' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

module.exports = router;