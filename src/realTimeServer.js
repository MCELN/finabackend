const { Server } = require('socket.io');
const chatService = require('./Services/chat.service');

const realTimeServer = (httpServer) => {
    const io = new Server(httpServer);
    console.log('io connected');

    io.on('connection', socket => {
        console.log(`Cliente con id ${socket.id} conectado.`);

        socket.on('addProd', async data => {
            try {
                io.emit('newProduct', data.title);
            } catch (error) {
                throw error;
            };
        });

        socket.on('errAddProd', async data => {
            try {
                socket.emit('errAdd', data);
            } catch (error) {
                throw error;
            };
        });

        socket.on('message', async data => {
            try {
                await chatService.create(data);
                const message = await chatService.getAll();

                io.emit('messageLogs', message);
            } catch (error) {
                throw error;
            };
        });

        socket.on('auth', async data => {
            try {
                const messages = await chatService.getAll();
                socket.emit('messageLogs', messages);

                socket.broadcast.emit('newUser', data);
            } catch (error) {
                throw error;
            };
        });
    });
};

module.exports = realTimeServer;

