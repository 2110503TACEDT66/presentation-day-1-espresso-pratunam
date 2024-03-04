const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  ProviderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  },
  Brand: {
    type: String,
    required: [true, 'Please add a brand'],
  },
  Model: {
    type: String,
    required: [true, 'Please add a Model'],
  },
  Year: {
    type: Number,
  },
  Type: {
    type: String,
    enum: ['Sedan', 'SUV', 'Truck', 'Convertible', 'Van', 'Other'],
    default: 'Other',
    required: [true, 'Please add a type'],
  },
  Color: {
    type: String,
  },
  RegistrationNumber: {
    type: String,
    unique: true,
    required: true,
  },
  Available: {
    type: Boolean,
    default: true,
  },
},{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});
CarSchema.virtual('Providers', {
  ref: 'Provider',
  localField: 'ProviderID',
  foreignField: '_id',
  justOne: false
});

CarSchema.virtual('Bookings',{
  ref: 'Booking',
  localField: '_id',
  foreignField: 'CarID',
  justOne: false
});

CarSchema.pre('deleteOne', {document: true, query: false},
 async function(next) {
    console.log('Bookings being removed from Car ' + this._id );
    await this.model('Booking').deleteMany({car: this._id});
    next();
})

module.exports = mongoose.model('Car', CarSchema);


