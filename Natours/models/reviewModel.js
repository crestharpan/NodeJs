//review //rating //createdAt //reftotour //ref to user
const mongoose = require('mongoose');

const reveiwSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'The review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'the review must belong to a tour'],
    },

    users: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'the review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
const Review = mongoose.Model('Review', reveiwSchema);
module.exports = Review;
