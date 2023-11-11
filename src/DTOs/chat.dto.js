class ChatDto {
    constructor(newMessage) {
        this.user = newMessage.user;
        this.message = newMessage.message;
    };
};

module.exports = ChatDto;