class ProductsDto {
    constructor(productInfo) {
        this.title = productInfo.title;
        this.description = productInfo.description;
        this.price = productInfo.price;
        this.thumbnail = productInfo.thumbnail || [];
        this.code = productInfo.code;
        this.status = productInfo.status;
        this.category = productInfo.category;
        this.stock = productInfo.stock;
    };
};

module.exports = ProductsDto;