const Tickets = require('./models/ticket.model');

class TicketsDao {

    async getAll() {
        try {
            return await Tickets.find();
        } catch (error) {
            throw error;
        };
    };

    async getById(id) {
        try {
            const ticket = await Tickets.findById(id);
            return ticket;
        } catch (error) {
            throw error;
        };
    };

    async getOne(prop) {
        try {
            const ticket = await Tickets.findOne(prop);
            return ticket;
        } catch (error) {
            throw error;
        };
    };

    async create(ticketInfo) {
        try {
            const newTicket = await Tickets.create(ticketInfo);
            return newTicket;
        } catch (error) {
            throw error;
        };
    };
};

module.exports = TicketsDao;