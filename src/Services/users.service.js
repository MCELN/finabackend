const { UsersDao } = require('../adapters/factory');
const UsersDto = require('../DTOs/users.dto');
const cartService = require('./carts.service');
const { getHashPassword } = require('../utils/bcrypt.util');

const Users = new UsersDao();

const getAll = async () => {
    try {
        const users = await Users.getAll();
        return users;
    } catch (error) {
        throw error;
    };
};

const getById = async (id) => {
    try {
        const user = await Users.getById(id);
        return user;
    } catch (error) {
        throw error;
    };
};

const getOne = async (prop) => {
    try {
        const user = await Users.getOne(prop);
        return user;
    } catch (error) {
        throw error;
    };
};

const updateOne = async (id, userInfo) => {
    try {
        return await Users.updateOne(id, userInfo);
    } catch (error) {
        throw error;
    };
};

const create = async (userInfo) => {
    try {
        const {
            first_name,
            last_name,
            email,
            age,
            password,
        } = userInfo;

        if (!first_name || !last_name || !email || !age || !password) return 'Bad request!';

        const userExists = await Users.getOne({ email })

        if (userExists) return 'E-Mail en uso';

        userInfo.cart = await cartService.create();

        const pass = getHashPassword(password);
        userInfo.password = pass;

        const newUser = new UsersDto(userInfo);
        const user = await Users.create(newUser);
        return user;
    } catch (error) {
        throw error;
    };
};

module.exports = {
    getAll,
    getById,
    getOne,
    updateOne,
    create,
}