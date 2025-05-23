const {Schema, model} = require('mongoose')

const transactionSchema = new Schema({
  userId: {
    type: String,
    required: true
  },

  userName: {
    type: String,
    required: true
  },

  spendType: {
    type: String,
    enum: [
        "Living & Housing",
        "Groceries & Essentials",
        "Transportation",
        "Food-Dining",
        "Bills-Subscriptions",
        "Health-Wellness",
        "Entertainment-Leisure",
        "Shopping",
        "Education",
        "Miscellaneous"
    ],
    required: true
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  toUserId: {
    type: String,
    required: true,
  },

  toUserName: {
    type: String,
    required: true,
  },

  flag: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Transaction', transactionSchema);
