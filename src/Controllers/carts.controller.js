const { Router } = require('express');
const cartService = require('../Services/carts.service');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await cartService.getAll();
        res.json({ status: 'success', payload: carts });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    };
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getById(cid);
        res.json({ status: 'success', payload: cart });
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

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const qty = req.body.quantity;
        const response = await cartService.updateOne(cid, pid, qty);

        if (response === 400) return res.status(400).json({ status: 'error', error: 'Bad request' });
        if (response === 'notstock') return res.status(400).json({ status: 'error', error: 'No se encuentra en stock' });

        res.status(201).json({ status: 'succes', payload: response });
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