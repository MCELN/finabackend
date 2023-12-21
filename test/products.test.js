const mongoose = require('mongoose')
const chai = require('chai');
const productsService = require('../src/Services/products.service');
const { db } = require('../src/config/index');

const expect = chai.expect;

describe('Test products service', function () {
    before(async function () {
        await mongoose.connect(
            `mongodb+srv://${db.user}:${db.pass}@${db.host}/test?retryWrites=true&w=majority`,
        );
        await mongoose.connection.collections.products.drop();
    });

    const mockProduct = {
        title: 'test',
        description: 'test',
        price: 1,
        thumbnail: 'test',
        code: 'test4',
        status: true,
        category: 'test',
        stock: 1
    };

    const mockProductUpdate = {
        price: 2
    }

    let createdProductId;

    it('Debe crear un nuevo producto con id de mongo', async function () {
        this.timeout(10000);
        const result = await productsService.create(mockProduct);
        createdProductId = result._id;
        expect(result).to.have.property('_id');
    });

    it('Debe obtener todos los productos en un array', async () => {
        const result = await productsService.getAll();
        expect(result).to.be.an('array');
    });

    it('Debe obtener un producto por su id', async () => {
        const result = await productsService.getById(createdProductId);
        expect(result).to.be.an('object');
    })

    it('Debe actualizar un producto por su id', async () => {
        await productsService.updateOne(createdProductId, mockProductUpdate);
        const productUp = await productsService.getById(createdProductId);
        expect(productUp.price).to.equal(2);
    })
});