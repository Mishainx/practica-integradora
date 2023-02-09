
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

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

//Plugin Paginate antes de iniciar el esquema
productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection, productSchema);