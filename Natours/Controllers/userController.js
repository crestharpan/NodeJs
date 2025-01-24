const fs = require('fs');

//reading the data from dev-data
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

// ROUTE HANDLERS
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'successful',
    data: {
      users,
    },
  });
};
exports.getUser = (req, res) => {
  const id = req.params.id;
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
