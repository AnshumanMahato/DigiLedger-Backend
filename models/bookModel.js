const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A book must have a name'],
  },
  standingAmount: {
    type: Number,
    default: 0,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
