const fs = require('fs');
const express = require('express');

//reading the data from dev-data
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);
// ROUTE HANDLERS
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'successful',
    data: {
      users,
    },
  });
};
const getUser = (req, res) => {
  const id = req.params.id;
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
