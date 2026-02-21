const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },

    menuitemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menuitem',
      required: [true, 'Menuitem required'],
    },

    milkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milk',
      required: [true, 'Milk required'],
    },

    sizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Size',
      required: [true, 'Size required'],

    },

    temperature: {
      type: String,
      enum: ['NA', 'HOT', 'ICED'], 
      required: [true, 'Temperature required'],
    },

    sugar: {
      type: String,
      enum: ['NA', '0%', '25%', '50%','75%', '100%'], 
      required: [true, 'Sugar required'],
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    unitPrice: {
      type: Number,
      default: 0.0,
      min: 0,
    },
  },
  {
    timestamps: true,
});

module.exports = mongoose.model('Cart', CartSchema);