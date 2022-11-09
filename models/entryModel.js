const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
  amount: Number,
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
