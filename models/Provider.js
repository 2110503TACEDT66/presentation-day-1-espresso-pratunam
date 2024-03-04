const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
},{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

ProviderSchema.virtual('Cars',{
  ref: 'Car',
  localField: '_id',
  foreignField: 'ProviderID',
  justOne: false
});
ProviderSchema.virtual('Bookings',{
  ref: 'Booking',
  localField: '_id',
  foreignField: 'ProviderID',
  justOne: false
});



ProviderSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

ProviderSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

ProviderSchema.methods.matchPassword = async function (enteredPassword) {
  // console.log(`Logging in with : ${enteredPassword}`)
  // console.log(`Password to compare: ${this.password}`)
  console.log(enteredPassword == this.password)
  console.log((await bcrypt.compare(enteredPassword, this.password)));
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Provider', ProviderSchema);
