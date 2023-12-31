const chai = require('chai');
const mongoose = require('mongoose');
const supertest = require('supertest');
const { db } = require('../src/config/index');



const expect = chai.expect;
const requester = supertest('http://localhost:3000');

describe('Testing del trabajo final de backend-coderhouse', function () {
    before(async function () {
        this.timeout(5000);

        await mongoose.connect(
            `mongodb+srv://${db.user}:${db.pass}@${db.host}/${db.test}?retryWrites=true&w=majority`,
        );
    });

    describe('Registrar un nuevo usuario', function () {
        const userMock = {
            first_name: 'test',
            last_name: 'test',
            email: `test${Math.floor(Math.random() * 1000)}@test.com`,
            age: 1,
            password: 'test',
        }

        it('Debe registrar un nuevo usuario y obtener un cart, verify, role', async function () {
            const response = await requester.post('/auth/register').send(userMock);
            expect(response.statusCode).to.equal(201);
            expect(response.body.payload).to.have.an.property('verify');
            expect(response.body.payload).to.have.an.property('role');
            expect(response.body.payload).to.have.an.property('cart');
            expect(response.body.payload).to.have.an.property('verified');
            expect(response.body.payload).to.have.an.property('createdAt');
        })
    })


})