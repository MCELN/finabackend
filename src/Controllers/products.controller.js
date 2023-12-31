const { Router } = require('express');
const productsService = require('../Services/products.service');
const userService = require('../Services/users.service');
const { isValidObjectId } = require('mongoose');
const { authToken } = require('../utils/jwt.util');
const protectedRoutePremium = require('../middlewares/protected-route-premium');
const protectedRouteAdmin = require('../middlewares/protected-route');
const { sendDeleteProductPremium } = require('../utils/send-mail.util');

const router = Router();

router.get('/', authToken, async (req, res) => {
    try {

        const userResponse = await userService.usersProducts(req.user._id);

        const { userAdmin, userPremium, userUser, cid, verified, user } = userResponse;

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

        const responseProducts = await productsService.paginate(filter, queryOption);

        const serializedProducts = responseProducts.docs.map(product => product.serialize());

        const { prevPage, nextPage, hasPrevPage, hasNextPage } = responseProducts;


        const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}${sort ? "&sort=" + sort : ""}${query ? "&query=" + query : ""}` : null;
        const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}${sort ? "&sort=" + sort : ""}${query ? "&query=" + query : ""}` : null;


        res.render(
            'products',
            {
                serializedProducts,
                verified,
                cid,
                prevLink,
                nextLink,
                user,
                userAdmin,
                userPremium,
                userUser,
                style: 'home.css',
            },
        );

    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.get('/:pid', authToken, async (req, res) => {
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

router.post('/', authToken, protectedRoutePremium, async (req, res) => {
    try {
        const productInfo = req.body;
        const userId = req.user._id;

        const newProduct = await productsService.create(userId, productInfo);
        if (newProduct === 'code') {
            res.status(401).json({ status: 'error', message: 'El código del producto ya existe.' });
        } else if (newProduct === 'campos') {
            res.status(401).json({ status: 'error', message: 'Faltan campos obligatorios.' });
        } else {
            res.status(201).json({ status: 'success', payload: newProduct });
        };
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.put('/:pid', authToken, async (req, res) => {
    try {
        const { pid } = req.params;
        if (req.body.stock) req.body.stock = parseInt(req.body.stock);
        if (req.body.price) req.body.price = parseInt(req.body.price);
        const productUp = await productsService.updateOne(pid, req.body);
        res.status(201).json({ status: 'success', payload: productUp });
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.delete('/:pid', authToken, protectedRouteAdmin, async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productsService.getById(pid);
        const response = await productsService.deleteOne(pid);
        if (product.createdBy._id) {
            const user = await userService.getById(product.createdBy._id);
            sendDeleteProductPremium(user, product);
        };
        if (response === 200) {
            res.json({ status: 'success' });
        } else {
            res.status(204).json({ status: 'error', message: 'El producto que desea eliminar no existe.' });
        }
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

module.exports = router;