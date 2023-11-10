const Products = require('./models/products.model')

class ProductsDao {

    async getAll() {
        try {
            return await Products.find();
        } catch (error) {
            throw error;
        };
    };

    async getById(id) {
        try {
            const product = await Products.findById(id);
            return product;
        } catch (error) {
            throw error;
        };
    };

    async getOne(prop) {
        try {
            const product = await Products.findOne(prop);
            return product;
        } catch (error) {
            throw error;
        };
    };

    async create(productInfo) {
        try {
            await Products.create(productInfo);
            return productInfo;
        } catch (error) {
            throw error;
        };
    };

    async updateOne(id, productUpdate) {
        try {
            const productUp = await Products.updateOne({ _id: id }, { $set: productUpdate });
            return productUp;
        } catch (error) {
            throw error;
        };
    };

    async deleteOne(id) {
        try {
            await Products.deleteOne({ _id: id });
            return;
        } catch (error) {
            throw error;
        };
    };
};

module.exports = ProductsDao;