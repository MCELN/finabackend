const mongoose = require('mongoose');

const messageCollection = 'message';

const messageSchema = mongoose.Schema({
    user: String,
    message: String,
});

const Chat = mongoose.model(messageCollection, messageSchema);

module.exports = Chat;