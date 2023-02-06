
import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: {
    type:String,
    unique:true
  },
  price: Number,
  thumbnail: Array,
  stock: Number,
  category: String,
  status: Boolean,
});

export const productModel = mongoose.model(productCollection, productSchema);