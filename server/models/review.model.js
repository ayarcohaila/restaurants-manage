const mongoose = require('mongoose');
const { Schema } = mongoose;

const positiveNumber = rate => rate >= 0 && rate <= 5;

const ReviewSchema = new Schema(
  {
    date: {
      type: Date,
      default: new Date(),
    },
    rate: {
      type: Number,
      default: 0,
      validate: [
        positiveNumber,
        'rate should be bigger than 0 and smaller than 5',
      ],
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
    reply: {
      type: String,
      trim: true,
      default: '',
    },
    restaurant: {
      type: Schema.ObjectId,
      ref: 'Restaurant',
    },
  },
  {
    timestamp: true,
  },
);

module.exports = mongoose.model('Review', ReviewSchema);
