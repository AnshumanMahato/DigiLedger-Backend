exports.getAllEntries = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'from getAllEntry',
    },
  });
};

exports.getEntry = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'from getEntry',
      params: req.params,
    },
  });
};

exports.createEntry = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'from CreateEntry',
      body: req.body,
    },
  });
};

exports.updateEntry = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'from UpdateEntry',
      params: req.params,
      body: req.body,
    },
  });
};

exports.deleteEntry = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'from deleteEntry',
      params: req.params,
    },
  });
};
