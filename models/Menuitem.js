const mongoose = require('mongoose');

const MenuitemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      default: 0.0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    milkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milk',
      required: [true, 'Milk id is required'],
    },
    sizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Size',
      required: [true, 'Size id is required'],
    },
    temperature: {
      type: String,
      enum: ['NA', 'HOT', 'ICED'], 
      default: 'HOT', // no choice, ie lemonade
    },
    sugar: {
      type: String,
      enum: ['NA', '0%', '25%', '50%','75%', '100%'], 
      default: '0%',
    },
    

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Menuitem', MenuitemSchema);
