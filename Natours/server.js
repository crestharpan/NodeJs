const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});
const Tour = mongoose.model('Tour', tourSchema);

//creating a document based on model
const tourTest = new Tour({
  name: 'Hiking',
  rating: 4.9,
  price: 599,
});
tourTest
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });
//START SERVERS
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
