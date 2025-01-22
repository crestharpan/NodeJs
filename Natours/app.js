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
