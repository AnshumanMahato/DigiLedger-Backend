const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    //debit what comes in, credit what goes out
    enum: ['credit', 'debit'],
    required: [true, 'A transaction must have a type <debit | credit>'],
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
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'A transaction must always be associated with a book'],
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
