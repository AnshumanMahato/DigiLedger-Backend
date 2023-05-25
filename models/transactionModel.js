const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    //debit what comes in, credit what goes out
    enum: ['income', 'expense'],
    required: [true, 'A transaction must have a type <income | expense>'],
  },
  amount: {
    type: Number,
    required: [true, 'A transaction must have an amount'],
    min: 1,
  },
  description: {
    type: String,
    maxlength: [100, `Description cannot be more than 100 characters long`],
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
