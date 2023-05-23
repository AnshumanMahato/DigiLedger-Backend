const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A ledger must have a type <debit | credit>'],
  },

  description: {
    type: String,
    maxlength: [250, `Description cannot be more than 250 characters long`],
  },
});

const Ledger = mongoose.model('Ledger', ledgerSchema);

module.exports = Ledger;
