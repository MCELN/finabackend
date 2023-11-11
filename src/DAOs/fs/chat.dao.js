const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ChatDao {
    #path = '';
    #Chat = [];

    constructor() {
        this.#path = (process.cwd() + '/src/files/chat.json');
        try {
            const chatFile = fs.readFileSync(this.#path, 'utf-8');
            this.#Chat = chatFile ? JSON.parse(chatFile) : [];
        } catch (error) {
            throw error;
        };
    };

    async getAll() {
        try {
            const chats = await fs.promises.readFile(this.#path, 'utf-8');
            if (!chats) return [];
            return JSON.parse(chats);
        } catch (error) {
            throw error;
        };
    };

    async create(newMessage) {
        try {
            newMessage._id = uuidv4();
            this.#Chat.push(newMessage);
            const response = await fs.promises.writeFile(this.#path, JSON.stringify(this.#Chat));
            return response;
        } catch (error) {
            throw error;
        };
    };
};

module.exports = ChatDao;