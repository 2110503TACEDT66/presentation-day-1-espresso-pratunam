const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  CarID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  ProviderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  },
  StartDate: {
    type: Date,
    required: true,
  },
  EndDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
}
},{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

BookingSchema.virtual('User',{
  ref: 'User',
  localField: 'UserID',
  foreignField: '_id',
  justOne: false
});

module.exports = mongoose.model('Booking', BookingSchema);
