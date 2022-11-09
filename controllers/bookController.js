exports.getAllBooks = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'from getAllBook',
    },
  });
};

exports.getBook = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'from getBook',
      params: req.params,
    },
  });
};

exports.createBook = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'from CreateBook',
      body: req.body,
    },
  });
};

exports.updateBook = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'from UpdateBook',
      params: req.params,
      body: req.body,
    },
  });
};

exports.deleteBook = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'from deleteBook',
      params: req.params,
    },
  });
};
