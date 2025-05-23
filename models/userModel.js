const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    stripeId: {
        type: String,
        required: true
    },
    balance: {
    type: Number,
    default: 0
    },
    transactions: {
    type: Array,
    default: []
    },
    password: {
        type: String,
        required: true
    },
    role : {
        type: String,
        default: 'user',
    },
    disabled : {
        type: Boolean,
        default: true,
    },
    isdeleted : {
        type: Boolean,
        default: false,
    },
    transactionvolume : {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    fraudFlags: [{
        reason: String,
        date: { type: Date, default: Date.now }
    }]
})

module.exports = model('users', userSchema)