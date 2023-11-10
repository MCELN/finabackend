const Carts = require('./models/carts.model');
const CartsDto = require('../../DTOs/carts.dto');

class CartsDao {

    async getAll() {
        try {
            const carts = await Carts.find();
            return carts;
        } catch (error) {
            throw error;
        };
    };

    async getById(id) {
        try {
            const cart = await Carts.findById(id);
            return cart;
        } catch (error) {
            throw error;
        };
    };

    async create(cartInfo) {
        try {
            const newCart = await Carts.create(cartInfo);
            return newCart._id;
        } catch (error) {
            throw error;
        };
    };

    async updateOne(id, pid, qty, newProduct) {
        try {
            if (!newProduct) {
                const result = await Carts.updateOne(
                    { _id: id, 'products.product': pid },
                    { $set: { 'products.$.quantity': qty } }
                );
                return result;
            } else {
                const result = await Carts.updateOne({ _id: id }, { $push: { products: newProduct } })
                return result;
            }
        } catch (error) {
            throw error;
        };
    };

    async deleteOneProd(id, pid) {
        try {
            const result = await Carts.updateOne(
                { _id: id },
                { $pull: { products: { product: pid } } }
            );
            return result;
        } catch (error) {
            throw error;
        };
    };

    async deleteAllProd(id) {
        try {
            const result = await Carts.updateOne(
                { _id: id },
                { $set: { products: [] } }
            )
            return result;
        } catch (error) {
            throw error;
        };
    };
};

module.exports = CartsDao;