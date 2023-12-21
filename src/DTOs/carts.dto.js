class CartsDto {
    constructor() {
        this.products = [];
        this.updateCartAt = Date.now();
    }
}

module.exports = CartsDto;