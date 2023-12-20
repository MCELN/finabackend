const Users = require('./models/users.model');

class UsersDao {

    async getAll() {
        try {
            const users = Users.find();
            return users;
        } catch (error) {
            throw error;
        };
    };

    async getById(id) {
        try {
            const user = Users.findById(id);
            return user;
        } catch (error) {
            throw error;
        };
    };

    async getOne(prop) {
        try {
            const user = Users.findOne(prop);
            return user;
        } catch (error) {
            throw error;
        };
    };

    async getByIdForHandlebars(id) {
        try {
            const user = Users.findById(id).lean();
            return user;
        } catch (error) {
            throw error;
        };
    };

    async updateOne(id, userInfo) {
        try {
            return await Users.updateOne({ _id: id }, { $set: userInfo });
        } catch (error) {
            throw error;
        };
    };

    async create(userInfo) {
        try {
            console.log('dao create', userInfo)
            const newUser = await Users.create(userInfo);
            return newUser;
        } catch (error) {
            throw error;
        };
    };
};

module.exports = UsersDao;