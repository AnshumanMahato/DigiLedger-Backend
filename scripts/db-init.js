const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { database } = require('../config');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

async function importData() {
  const users = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8')
  );
  const transactions = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/transactions.json'), 'utf-8')
  );

  try {
    await Transaction.create(transactions);
    await User.create(users, { validateBeforeSave: false });
    console.log('Data Imported Successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

async function deleteData() {
  try {
    await Transaction.deleteMany();
    await User.deleteMany();
    console.log('Data Deleted Successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

mongoose
  .connect(database)
  .then(() => {
    console.log('DB Connected');

    switch (process.argv[2]) {
      case '--import':
        importData();
        break;
      case '--delete':
        deleteData();
        break;
      default:
        console.log('Please provide --import or --delete');
        process.exit();
    }
  })
  .catch(() => console.log('Failed to connect'));
