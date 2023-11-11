const ChatDto = require('../DTOs/chat.dto');
const { ChatDao } = require('../adapters/factory');

const Chat = new ChatDao();

const getAll = async () => {
    try {
        return await Chat.getAll();
    } catch (error) {
        throw error;
    };
};

const create = async (message) => {
    try {
        const newMessage = new ChatDto(message);
        await Chat.create(newMessage);
        return;
    } catch (error) {
        throw error;
    };
};

module.exports = {
    getAll,
    create,
}