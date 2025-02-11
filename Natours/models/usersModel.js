const mongoose = require('mongoose');

const slugify = require('slugify');

const validator = require('validator');

const bcrypt = require('bcryptjs');

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the password'],
    minlength: [6, 'The password must be greater than 7 characters'],
    maxlength: [11, 'The password must be less than 11 characters'],
    upperCase: true,
    //ONLY WORKS ON CREATE & SAVE
    validate: {
      validator: function (el) {
        return this.password === el; //CONFIRMING THE PASSWORD(RETURN EITHER TRUE OR FALSE)
      },
      message: 'Password did not matched',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
});

//DOCUMENT-MIDDLEWARE
userSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lowercase: true });
  next();
});

//IF PASSWORD FIELD IS NOT MODIFIED EXIT THE FUNCTION
userSchema.pre('save', async function (next) {
  // RUN THE FUNCTION WHEN PASSWORD IS MODIFIED
  if (!this.isModified('password')) return;

  //ENCRYPT THE PASSWORD
  this.password = await bcrypt.hash(this.password, 12); //hash is async so it returns promise

  //DELETE THE PASSWORD FIELD
  this.passwordConfirm = undefined;
  next();
});

//INSTANCE METHOD-(RETURNS EITHER TRUE OR FALSE ONLY)
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//INSTANCE METHOD FOR CHECKING THE PASSWORD CHANGED OR NOT
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return changeTimestamp > JWTTimeStamp;
  }
  return false; //FALSE MEANS NOT-CHANGED AND TRUE MEANS CHANGED
};

const User = mongoose.model('User', userSchema);
module.exports = User;
