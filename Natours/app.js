const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json());

//route
//reading the tour data from dev-data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get('/api/V1/tours', (req, res) => {
  res.status(200).json({
    //sending with jsend
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//reading the tour data of specific id
app.get('/api/V1/tours/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // if (id > tours.length - 1) {
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'Fail',
      message: 'Invalid Tour ID',
    });
  } else {
    res.status(200).json({
      //sending with jsend
      status: 'Success',
      data: {
        tour,
      },
    });
  }
});

//getting the req from client
app.post('/api/V1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'successful',
        data: newTour,
      });
    }
  );
});

const port = 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
