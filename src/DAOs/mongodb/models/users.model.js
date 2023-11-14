const mongoose = require('mongoose');

const userCollection = 'user';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        index: true,
    },
    age: Number,
    password: String,
    cart: String,
    status: Boolean,
    role: String,
    date: {
        type: Date,
        default: Date.now(),
    },
});

userSchema.methods.serialize = function () {
    return {
        _id: this._id,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        age: this.age,
        password: this.password,
        cart: this.cart,
        status: this.status,
        role: this.role,
        date: this.date,
    };
};

const Users = mongoose.model(userCollection, userSchema);

module.exports = Users;