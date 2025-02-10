const mongoose = require('mongoose');

const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
      maxlength: [40, 'A tour name must less than or equal to 40 chars'],
      minlength: [10, 'A tour name must be greater than or equal to 10 chars'],
      unique: true,
      // validate: {
      //   message: 'A tour name must be only letters',
      //   validator: validator.isAlpha,
      // },
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'A difficulty can either be easy, meduim or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be greater than 1'],
      max: [5, 'A rating must be less than 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      //CUSTOM VALIDATOR
      //this will only point to the new document which is created using POST and not to update.
      validate: {
        message:
          'The Discount price({VALUE}) should be less than original price',
        validator: function (val) {
          return val < this.price;
        },
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    secret: {
      type: Boolean,
      default: false,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE
//IT RUNS BEFORE THE .SAVE() AND .CREATE() EVENT WHERE THE CALLBACK FUNCTION IS EXECUTED
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lowercase: true });
  next();
});

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
