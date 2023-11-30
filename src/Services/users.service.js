const { UsersDao } = require('../adapters/factory');
const UsersDto = require('../DTOs/users.dto');
const cartService = require('./carts.service');
const { getHashPassword } = require('../utils/bcrypt.util');
const { v4: uuidv4 } = require('uuid');
const transport = require('../utils/nodemailer.util');
const { mailer } = require('../config');

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
        userInfo.verify = uuidv4();
        userInfo.verified = false;

        const hashedPassword = getHashPassword(password);
        userInfo.password = hashedPassword;

        const newUser = new UsersDto(userInfo);
        const user = await Users.create(newUser);

        const verifyLink = `http://localhost:3000/auth/verify/${user.email}/${user.verify}`;

        await transport.sendMail({
            from: mailer.userMail,
            to: user.email,
            subject: `Bienvenido a nuestra web, ${user.first_name}!!!`,
            html: `
                <div>
                    <h1>Gracias por elegirnos ${user.first_name}!!</h1>
                    <p>Para poder comprar nuestros productos es necesario verificar tu correo electrónico.</p>
                    <p>Sólo debes seguir el enlace en el botón VERIFICAR CORREO</p>
                    <a href="${verifyLink}" style="text-decoration: none;">
                        <button type="button" style="background-color: #3498db; color: #ffffff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">VERIFICAR CORREO</button>
                    </a>
                </div>
            `
        })
        return user;
    } catch (error) {
        throw error;
    };
};

const verifyMail = async (email, verify) => {
    try {
        const user = await Users.getOne({ email });
        if (user && user.verify === verify) {
            const result = await Users.updateOne(user._id, { verified: true })
            return result
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