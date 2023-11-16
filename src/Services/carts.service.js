const { CartsDao } = require('../adapters/factory');
const CartsDto = require('../DTOs/carts.dto');
const productsService = require('../Services/products.service');
const { environment } = require('../config')

const Carts = new CartsDao();

const getAll = async () => {
    try {
        const carts = await Carts.getAll();
        return carts;
    } catch (error) {
        throw error;
    };
};

const getById = async (id) => {
    try {
        const result = await Carts.getById(id);
        return result;
    } catch (error) {
        throw error;
    };
};

const getByIdForHandlebars = async (id) => {
    try {
        return await Carts.getByIdForHandlebars(id);
    } catch (error) {
        throw error;
    };
};

const create = async (cartInfo) => {
    try {
        const newCart = new CartsDto(cartInfo);
        const cart = await Carts.create(newCart);
        return cart;
    } catch (error) {
        throw error;
    };
};

const updateOne = async (id, pid, qty) => {
    try {
        const cart = await Carts.getById(id);
        const product = await productsService.getById(pid);

        if (!product || !cart) return 400;

        const index = cart.products.findIndex(p => environment === 'devfs' ? p.product === pid : p.product.equals(pid));
        const totalProd = index >= 0 ? cart.products[index].quantity + qty : qty;

        if (index >= 0) {
            if (product.stock >= qty) {
                await Carts.updateOne(id, pid, totalProd);
                await productsService.updateOne(pid, { stock: (product.stock - qty) });
                return `Se ${qty > 1 ? 'han' : 'ha'} agregado ${qty} ${qty > 1 ? 'unidades' : 'unidad'} de ${product.title} a su carrito.`;
            } else {
                return 'notstock';
            };
        } else {
            if (product.stock >= qty) {
                const newProduct = {
                    product: pid,
                    quantity: qty,
                };

                await Carts.updateOne(id, pid, qty, newProduct);
                await productsService.updateOne(pid, { stock: (product.stock - qty) });
                return `Se ${qty > 1 ? 'han' : 'ha'} agregado ${qty} ${qty > 1 ? 'unidades' : 'unidad'} de ${product.title} a su carrito.`;
            } else {
                return 'notstock';
            }
        }

    } catch (error) {
        throw error;
    };
};

const deleteOneProd = async (id, pid) => {
    try {
        const cart = await Carts.getById(id);
        const product = await productsService.getById(pid);
        if (!cart || !product) return 401;
        await Carts.deleteOneProd(id, pid);
        return `El producto ${product.title} ha sido eliminado de su carrito.`
    } catch (error) {
        throw error;
    };
};

const deleteAllProd = async (id) => {
    try {
        const cart = await Carts.getById(id);
        if (!cart) return 401;
        await Carts.deleteAllProd(id);
        return 'Su carrito ahora está vacío.';
    } catch (error) {
        throw error;
    };
};



module.exports = {
    getAll,
    getById,
    getByIdForHandlebars,
    create,
    updateOne,
    deleteOneProd,
    deleteAllProd,
}