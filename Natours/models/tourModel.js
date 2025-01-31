const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A true must have duration!'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
    unique: true,
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have total number of people'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must specify difficulty level'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a descriptions'],
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a imgae'],
  },
  //will stores the array of references to the images
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
