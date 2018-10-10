const mongoose = require('mongoose');
const { Schema } = mongoose;

const RestaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamp: true,
  },
);

module.exports = mongoose.model('Restaurant', RestaurantSchema);
