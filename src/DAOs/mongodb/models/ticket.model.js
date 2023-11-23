const mongoose = require('mongoose');

const ticketCollection = 'ticket';

const ticketSchema = mongoose.Schema({
    code: String,
    purchase_datatime: {
        type: Date,
        default: Date.now(),
    },
    amount: Number,
    purchaser: String,
});

const Tickets = mongoose.model(ticketCollection, ticketSchema);

module.exports = Tickets;