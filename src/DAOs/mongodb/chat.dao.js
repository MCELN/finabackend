const Chat = require('./models/chat.model');

class ChatDao {
    async getAll() {
        try {
            return await Chat.find();
        } catch (error) {
            throw error;
        };
    };

    async create(newMessage) {
        try {
            await Chat.create(newMessage);
        } catch (error) {
            throw error;
        };
    };
};

module.exports = ChatDao;