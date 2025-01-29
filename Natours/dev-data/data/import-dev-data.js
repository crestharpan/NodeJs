const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const Db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(Db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection Successful'));

//READ FILE FORM TOURS-SIMPLE.JSON
const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8'),
);

//IMPORTING FILES TO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('successfully added all the data');
  } catch (err) {
    console.log(err);
  }
};

//DELETE ALL DATA FROM THE COLLECTION

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Deleted all the data');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
console.log(process.argv);
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
