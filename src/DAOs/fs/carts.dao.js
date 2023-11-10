const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class CartsDao {
    #path = '';
    #carts = [];

    constructor() {
        this.#path = (process.cwd() + '/src/files/carts.json');
        try {
            const cartsFiles = fs.readFileSync(this.#path, 'utf-8');
            this.#carts = cartsFiles ? JSON.parse(cartsFiles) : [];
        } catch (error) {
            throw error;
        };
    };

    async getAll() {
        try {
            const carts = await fs.promises.readFile(this.#path, 'utf-8');
            if (!carts) return [];
            return JSON.parse(carts);
        } catch (error) {
            throw error;
        };
    };

    async getById(id) {
        try {
            const result = await this.#carts.find(c => c._id === id);
            return result;
        } catch (error) {
            throw error;
        };
    };

    async create(cartInfo) {
        try {
            cartInfo._id = uuidv4();
            this.#carts.push(cartInfo);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts));
            return cartInfo._id;
        } catch (error) {
            throw error;
        };
    };

    async updateOne(id, pid, qty, newProduct) {
        try {
            const index = this.#carts.findIndex(c => c._id === id);
            const productIndex = this.#carts[index].products.findIndex(p => p.product === pid);
            if (!newProduct) {
                this.#carts[index].products[productIndex].quantity = qty;
            } else {
                this.#carts[index].products.push(newProduct);
            };
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts));
            return this.#carts[index].products;
        } catch (error) {
            throw error;
        };
    };

    async deleteOneProd(id, pid) {
        try {
            const index = this.#carts.findIndex(c => c._id === id);
            const productIndex = this.#carts[index].products.findIndex(p => p.product.equals(pid));
            this.#carts[index].products.splice(productIndex, 1);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts));
            return;
        } catch (error) {
            throw error;
        };
    };

    async deleteAllProd(id) {
        try {
            const index = this.#carts.findIndex(p => p._id === id);
            const allProd = this.#carts[index].products.length;
            this.#carts[index].products.splice(0, allProd);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts));
            return;
        } catch (error) {
            throw error;
        };
    };
};

module.exports = CartsDao;