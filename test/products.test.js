const mongoose = require('mongoose')
const chai = require('chai');
const supertest = require('supertest');
const { db } = require('../src/config/index');

const expect = chai.expect;
const requester = supertest('http://localhost:3000');

describe('Test products service', () => {
    before(async function () {
        this.timeout(5000);
        await mongoose.connect(
            `mongodb+srv://${db.user}:${db.pass}@${db.host}/${db.test}?retryWrites=true&w=majority`,
        );

    });

    const mockProduct = {
        title: 'test',
        description: 'test',
        price: 1,
        thumbnail: 'test',
        code: 'test',
        status: true,
        category: 'test',
        stock: 1
    };

    it('Debe crear un nuevo producto con id de mongo', async () => {
        const result = await Products.create(mockProduct);
        expect(result).to.have.property('_id');
    });

    it('Debe obtener todos los productos en un array', async () => {
        const result = await Products.getAll();
        expect(result).to.be.an('array');
    });

    it('Debe obtener un sólo producto según la id')
});