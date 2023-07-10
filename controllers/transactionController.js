const Transaction = require('../models/transactionModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const updatePartyAndCategory = async (user, party, category) => {
  //Updating party and category info
  const { __v } = user;
  if (party) {
    user.parties.addToSet(party.trim());
  }
  if (category) {
    user.categories.addToSet(category.trim().toLowerCase());
  }
  await user.save({ validateModifiedOnly: true });

  //Return true if user parties and categories are updated
  return __v !== user.__v;
};

exports.getAllTransactions = catchAsync(async (req, res, next) => {
  //BUILD QUERY
  // 1.Filtering
  const queryObj = { ...req.query };
  const excludedField = ['page', 'sort', 'limit', 'fields', 'user'];
  excludedField.forEach((el) => delete queryObj[el]);
  queryObj.user = req.user._id;
  // 2.Query Operators
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b[gte|gt|lte|lt]\b/g,
    (match) => `$${match}`
  );

  let query = Transaction.find(JSON.parse(queryString));
  // 3.SORT

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }

  // 4.Limit Fields
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }
  query = query.select('-__v');

  // 5. Pagination
  const limit = req.query.limit * 1 || 10;
  const page = req.query.page * 1 || 1;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const transactionCount = await Transaction.countDocuments(
    JSON.parse(queryString)
  );
  const totalPages =
    Math.floor(transactionCount / limit) + (transactionCount % limit ? 1 : 0);
  if (req.query.page) {
    if (skip >= transactionCount) throw new AppError('Page not found', 404);
  }

  //EXECUTE QUERY
  const transctions = await query;

  //SEND QUERY
  res.status(200).json({
    status: 'success',
    data: {
      totalPages,
      count: transctions.length,
      docs: transctions,
    },
  });
});

exports.getTransactionById = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    throw new AppError(`No transaction found with id: ${req.params.id}`, 404);
  }

  return res.status(200).json({
    status: 'success',
    data: transaction,
  });
});

exports.createTransaction = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  data.user = req.user._id;

  const transaction = await Transaction.create(data);

  const isUpdated = await updatePartyAndCategory(
    req.user,
    req.body.party,
    req.body.category
  );

  res.status(201).json({
    status: 'success',
    data: {
      transaction,
      updates: isUpdated && {
        parties: req.user.parties,
        categories: req.user.categories,
      },
    },
  });
});

exports.updateTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!transaction) {
    throw new AppError(`No transaction found with id: ${req.params.id}`, 404);
  }

  const isUpdated = await updatePartyAndCategory(
    req.user,
    req.body.party,
    req.body.category
  );

  return res.status(200).json({
    status: 'success',
    data: {
      transaction,
      updates: isUpdated && {
        parties: req.user.parties,
        categories: req.user.categories,
      },
    },
  });
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    throw new AppError(`No transaction found with id: ${req.params.id}`, 404);
  }

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getStatsByDate = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const data = await Transaction.aggregate([
    // This stage filters user's transaction with the provided time range
    {
      $match: {
        user: req.user._id,
        timestamp: {
          $gte: startDate * 1,
          $lte: endDate * 1,
        },
      },
    },
    // The stage allows execution of multiple sub pipelines
    {
      $facet: {
        // This pipeline is to calculate overall income and wxpense
        overall: [
          {
            $group: {
              _id: '$type',
              amount: { $sum: '$amount' },
            },
          },
        ],

        // This pipeline is to calculate income and wxpense based on the category
        categoryBased: [
          {
            $group: {
              _id: {
                category: '$category',
                type: '$type',
              },
              amount: { $sum: '$amount' },
            },
          },
          {
            $group: {
              _id: '$_id.type',
              data: {
                $push: {
                  category: '$_id.category',
                  amount: '$amount',
                },
              },
            },
          },
        ],

        // This pipeline is to calculate income and wxpense based on the party
        partyBased: [
          {
            $group: {
              _id: {
                party: '$party',
                type: '$type',
              },
              amount: { $sum: '$amount' },
            },
          },
          {
            $group: {
              _id: '$_id.type',
              data: {
                $push: {
                  party: '$_id.party',
                  amount: '$amount',
                },
              },
            },
          },
        ],
      },
    },
  ]);

  //Formatiing Aggegated data
  const [{ overall, categoryBased, partyBased }] = data;

  const stats = {
    overall: { expense: 0, income: 0 },
    categoryBased: { expense: [], income: [] },
    partyBased: { expense: [], income: [] },
  };
  overall.forEach((el) => {
    stats.overall[el._id] = el.amount;
  });
  categoryBased.forEach((el) => {
    stats.categoryBased[el._id] = el.data;
  });
  partyBased.forEach((el) => {
    stats.partyBased[el._id] = el.data;
  });

  return res.status(200).json({
    status: 'success',
    data: stats,
  });
});

exports.getMonthlyStats = catchAsync(async (req, res, next) => {
  const data = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
      },
    },
    /*
      This stage will groups all the transactions based on year month and type. Return a 
      bunch of documents whith the following structure:
      {
        _id:{
          year: 2023,
          month: 5
          type: <income | expense>
        }
        amount: <Some number>
      }

    */
    {
      $group: {
        _id: {
          year: { $year: { $toDate: '$timestamp' } },
          month: { $month: { $toDate: '$timestamp' } },
          type: '$type',
        },
        amount: { $sum: '$amount' },
      },
    },
    /*
    Now these documents will be further grouped into two objects each for income and expense. 
    each object will have a monthlyData array containg objects like 
    {
      year,
      month,
      amount
    }
    */
    {
      $group: {
        _id: '$_id.type',
        monthlyData: {
          $push: {
            year: '$_id.year',
            month: '$_id.month',
            amount: '$amount',
          },
        },
      },
    },
  ]);

  return res.status(200).json({
    status: 'success',
    data,
  });
});
