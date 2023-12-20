const { ProductsDao } = require('../adapters/factory');
const ProductsDto = require('../DTOs/products.dto');

const Products = new ProductsDao();

const getAll = async () => {
    try {
        return await Products.getAll();
    } catch (error) {
        throw error;
    };
};

const getById = async (id) => {
    try {
        const product = await Products.getById(id);
        return product;
    } catch (error) {
        throw error;
    };
};

const getOne = async ({ prop }) => {
    try {
        return await Products.getOne({ prop });
    } catch (error) {
        throw error;
    };
};

const paginate = async (filter, queryOption) => {
    try {
        return await Products.paginate(filter, queryOption);
    } catch (error) {
        throw error;
    };
};

const paginateFs = async (limit) => {
    try {
        return await Products.paginateFs(limit);
    } catch (error) {
        throw error;
    };
};

const create = async (productInfo) => {
    try {
        const {
            title,
            description,
            price,
            code,
            category,
            status,
            stock,
        } = productInfo;

        if (!title
            || !description
            || !price
            || !code
            || !category
            || !stock
        ) return 'campos';

        productInfo.status = status === 'on' ? true : false;
        const newProduct = new ProductsDto(productInfo);
        const exitsCode = await Products.getOne({ code });

        if (!exitsCode) {
            const product = await Products.create(newProduct);
            return product;
        } else {
            return 'code';
        };

    } catch (error) {
        throw error;
    };
};

const updateOne = async (id, productUpdate) => {
    try {
        const product = await Products.getById(id);
        if (product) {
            const reqProp = Object.keys(productUpdate);
            const props = ['title', 'description', 'price', 'thumbnail', 'code', 'status', 'category', 'stock'];
            const modProp = reqProp.filter(p => props.includes(p));
            const productUp = {};

            for (const prop of modProp) {
                productUp[prop] = productUpdate[prop];
            }
            const editProduct = await Products.updateOne(id, productUp);
            return editProduct;
        }
    } catch (error) {
        throw error;
    };
};

const deleteOne = async (id) => {
    try {
        const existsProd = await Products.getById(id);
        if (existsProd) {
            await Products.deleteOne(id);
            return 200;
        } else {
            return 204;
        }
    } catch (error) {
        throw error;
    };
};

module.exports = {
    getAll,
    getById,
    getOne,
    paginate,
    paginateFs,
    create,
    updateOne,
    deleteOne,
};