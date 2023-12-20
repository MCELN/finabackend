const { UsersDao } = require('../adapters/factory');
const UsersDto = require('../DTOs/users.dto');
const cartService = require('./carts.service');
const { getHashPassword } = require('../utils/bcrypt.util');
const { v4: uuidv4 } = require('uuid');
const { sendVerifyMail } = require('../utils/send-mail.util');
const { domain } = require('../config');

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

const getByIdForHandlebars = async (id) => {
    try {
        const user = await Users.getByIdForHandlebars(id);
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
        const currentUser = await Users.getById(id);
        if (!userInfo.email || userInfo.email === currentUser.email) {
            return await Users.updateOne(id, userInfo);
        } else {
            userInfo.verified = false;

        }

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

        console.log('service create2', userInfo)
        userInfo.cart = await cartService.create();
        userInfo.verify = uuidv4();
        userInfo.verified = false;

        const hashedPassword = getHashPassword(password);
        userInfo.password = hashedPassword;

        const newUser = new UsersDto(userInfo);
        const user = await Users.create(newUser);

        const verifyLink = `${domain}/auth/verify/${user.email}/${user.verify}`;

        sendVerifyMail(user, verifyLink);

        return user;
    } catch (error) {
        throw error;
    };
};

const verifyMail = async (email, verify) => {
    try {
        const user = await Users.getOne({ email });
        if (user) {
            if (user.verified) {
                return 'Cuenta verificada';
            } else if (user && !user.verified && (user.verify && user.verify === verify)) {
                user.verified = true;
                user.verify = null;
                await Users.updateOne(user._id, user);
                return 'Su cuenta ha sido verificada!'
            }
        }

        return "not found";

    } catch (error) {
        throw error;
    };
};

module.exports = {
    getAll,
    getById,
    getOne,
    getByIdForHandlebars,
    updateOne,
    create,
    verifyMail,
}