const { CartsDao } = require('../adapters/factory');
const CartsDto = require('../DTOs/carts.dto');
const productsService = require('../Services/products.service');
const usersService = require('../Services/users.service');
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

const create = async () => {
    try {
        const newCart = new CartsDto();
        const cart = await Carts.create(newCart);
        return cart;
    } catch (error) {
        throw error;
    };
};

const updateOne = async (id, cartInfo) => {
    try {
        const result = await Carts.updateOne(id, cartInfo);
        return result;
    } catch (error) {
        throw error;

    }
}

const updateOneProduct = async (id, pid, qty) => {
    try {
        const cart = await Carts.getById(id);
        const product = await productsService.getById(pid);

        if (!product || !cart) return 400;

        const index = cart.products.findIndex(p => environment === 'devfs' ? p.product === pid : p.product.equals(pid));
        const totalProd = index >= 0 ? cart.products[index].quantity + qty : qty;

        if (index >= 0) {
            if (product.stock >= totalProd) {
                await Carts.updateOneProduct(id, pid, totalProd);
                return `Se ${qty > 1 ? 'han' : 'ha'} agregado ${qty} ${qty > 1 ? 'unidades' : 'unidad'} de ${product.title} a su carrito.`;
            } else {
                return 'notstock';
            };
        } else {
            if (product.stock >= totalProd) {
                const newProduct = {
                    product: pid,
                    quantity: qty,
                };

                await Carts.updateOneProduct(id, pid, qty, newProduct);
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

const purchase = async (cid, uid) => {
    try {
        const user = await usersService.getById(uid);
        const cart = await Carts.getById(cid);
        const allProducts = await productsService.getAll();
        const notStock = [];
        const pay = [];
        const subtotal = [];

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

                subtotal.push(product);

                await Carts.deleteOneProd(cid, prod.product._id.toString());
            });
        }

    } catch (error) {
        throw error;
    };
};

const cartTime = async (id, updateCart) => {
    try {
        const maxCartTime = (Date.now() - (1000 * 60 * 15));
        if (updateCart < maxCartTime) {
            await Carts.deleteAllProd(id);
            return true;
        };
        const newDate = Date.now();
        await Carts.updateOne(id, { updateCartAt: newDate });
        return false;
    } catch (error) {
        throw error;
    };
}



module.exports = {
    getAll,
    getById,
    getByIdForHandlebars,
    create,
    updateOne,
    updateOneProduct,
    deleteOneProd,
    deleteAllProd,
    purchase,
    cartTime,
}