const mongoose = require('mongoose');

const slugify = require('slugify');

const validator = require('validator');

//name,email,photo,password,confirm password
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please tell your name'],
  },
  slug: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Add a Email address'],
    unique: true,
    lowercase: true,

    validate: [validator.isEmail, 'Please provide a valid emaila address'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please enter the password'],
    minlength: [6, 'The password must be greater than 7 characters'],
    maxlength: [11, 'The password must be less than 11 characters'],
    upperCase: true,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the password'],
    minlength: [6, 'The password must be greater than 7 characters'],
    maxlength: [11, 'The password must be less than 11 characters'],
    upperCase: true,
    validate: {
      validator: function (el) {
        return this.password === el; //CONFIRMING THE PASSWORD(RETURN EITHER TRUE OR FALSE)
      },
    },
  },
});

//MIDDLEWARE
userSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lowercase: true });
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
