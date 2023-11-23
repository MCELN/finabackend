const { v4: uuidv4 } = require('uuid');

class TicketsDto {
    constructor(ticketInfo) {
        this.code = ticketInfo.code || uuidv4();
        this.purchase_datetime = ticketInfo.purchase_datetime || Date.now();
        this.amount = ticketInfo.amount;
        this.purchaser = ticketInfo.purchaser;
    };
};

module.exports = TicketsDto;