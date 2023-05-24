const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A book must have name'],
    unique: [true, 'A book must have a unique name'],
  },
  description: {
    type: String,
    maxlength: [250, `Description cannot be more than 250 characters long`],
  },
  standingBalance: {
    type: Number,
    default: 0,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
