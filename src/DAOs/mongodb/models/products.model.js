const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productCollection = 'product';

const productSchema = mongoose.Schema({
    title: {
        type: String,
        index: true,
    },
    description: String,
    price: Number,
    thumbnail: [String],
    code: String,
    status: Boolean,
    category: String,
    stock: Number,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
});

productSchema.methods.serialize = function () {
    return {
        _id: this._id,
        title: this.title,
        description: this.description,
        price: this.price,
        thumbnail: this.thumbnail,
        code: this.code,
        status: this.status,
        category: this.category,
        stock: this.stock,
        createdBy: this.createdBy,
    };
};

productSchema.plugin(mongoosePaginate);

productSchema.pre(['find', 'findOne'], function () {
    this.populate({ path: 'createdBy', select: 'first_name last_name email' });
});

const Products = mongoose.model(productCollection, productSchema);

module.exports = Products;