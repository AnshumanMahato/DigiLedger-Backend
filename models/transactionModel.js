const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['paid', 'received'],
    default: 'paid',
  },
  amount: {
    type: Number,
    required: [true, 'A transaction must have an amount'],
    min: 1,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
