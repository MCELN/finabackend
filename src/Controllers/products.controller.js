const { Router } = require('express');
const productsService = require('../Services/products.service');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const response = await productsService.getAll();

        res.json({ status: 'success', response });
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