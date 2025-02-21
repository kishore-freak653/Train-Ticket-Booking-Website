import mongoose from "mongoose";
import User from "./Usermodel.js";
const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  category: {
    type: String,
    required: [true, "Please specify a category"],
  },
  price: {
    type: Number,
    required: [true, "Please specify a price"],
    min: [0, "Price should be more than or equal to zero"],
  },

  oldPrice: {
    type: Number,
    default: null,
  },
  images: [String],
  url: {
    type: String,
    required: true,
    unique: true,
  },
  startDate: {
    type: Date,
    required: [true, "Please add a start date"],
    default: Date.now,
  },
  endDate: {
    type: Date,

    default: function () {
      const date = new Date(this.startDate);
      date.setDate(date.getDate() + 7);
      return date;
    },
    DeliveryAmount: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
});

// Create compound index for efficient queries
ProductSchema.index({ owner: 1, category: 1 });
ProductSchema.index({ url: 1 }, { unique: true });

const Product = mongoose.model("Product", ProductSchema);

export default Product;