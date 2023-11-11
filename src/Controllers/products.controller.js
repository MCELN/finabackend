const { Router } = require('express');
const productsService = require('../Services/products.service');
const cartService = require('../Services/carts.service');
const { environment } = require('../config')

const router = Router();

router.get('/', async (req, res) => {
    try {
        if (environment === 'devfs') {
            try {
                const { limit = 10 } = req.query;
                const serializedMessages = await productsService.paginateFs(limit);
                res.render(
                    'products',
                    {
                        serializedMessages,
                        style: 'home.css',
                    },
                );
            } catch (error) {
                res.status(500).json({ status: 'error', error: 'Internal Error.' });
            };

        } else {
            const { limit = 10, page = 1, sort, query } = req.query;

            const pageNum = parseInt(page);

            let filter = {};

            if (query) {
                if (query === 'false' || query === 'true') {
                    filter = { status: query }
                } else {
                    filter = { category: query };
                }
            }

            const sortO = {};

            if (sort === 'asc') {
                sortO.price = 1;
            } else if (sort === 'desc') {
                sortO.price = -1;
            }

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

            const carts = await cartService.getAll();
            const cid = carts[0]._id;


            res.render(
                'products',
                {
                    serializedMessages,
                    cid,
                    prevLink,
                    nextLink,
                    // user,
                    // flag,
                    style: 'home.css',
                },
            );
        };

    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productsService.getById(pid);
        res.json({ status: 'success', payload: product });
    } catch (error) {
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
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
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
            res.json({ status: 'success' })
        } else {
            res.status(204).json({ status: 'error', message: 'El producto que desea eliminar no existe.' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

module.exports = router;