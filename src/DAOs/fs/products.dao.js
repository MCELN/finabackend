const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ProductsDao {
    #path = '';
    #products = [];

    constructor() {
        this.#path = (process.cwd() + '/src/files/products.json');
        try {
            const productsFile = fs.readFileSync(this.#path, 'utf-8');
            this.#products = productsFile ? JSON.parse(productsFile) : [];
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            const products = await fs.promises.readFile(this.#path, 'utf-8');
            if (!products) return [];
            return JSON.parse(products);
        } catch (error) {
            throw error;
        };
    };


    async getById(id) {
        try {
            return this.#products.find(p => p._id === id);
        } catch (error) {
            throw error;
        };
    };


    async getOne(prop) {
        try {
            const result = this.#products.find(product =>
                Object.entries(prop).every(([key, value]) =>
                    product[key] === value
                )
            );
            return result;
        } catch (error) {
            throw error;
        };
    };

    async create(productInfo) {
        try {
            productInfo._id = uuidv4();
            this.#products.push(productInfo);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products));
            return productInfo;
        } catch (error) {
            throw error;
        };
    };


    async updateOne(id, productUpdate) {
        try {
            const reqProp = Object.keys(productUpdate);
            const index = this.#products.findIndex(p => p._id === id);

            for (const prop of reqProp) {
                this.#products[index][prop] = productUpdate[prop];
            };
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products));
            return await this.getById(id);
        } catch (error) {
            throw error;
        };
    };


    async deleteOne(id) {
        try {
            const index = this.#products.findIndex(p => p._id === id);
            this.#products.splice(index, 1);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products));
            return;
        } catch (error) {
            throw error;
        };
    };
};

module.exports = ProductsDao;