const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', UserSchema);