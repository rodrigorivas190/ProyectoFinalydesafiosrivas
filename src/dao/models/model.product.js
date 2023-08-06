import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: Array,
  code: String,
  stock: Number,
  category: String,
  status: Boolean,
});

productSchema.plugin(mongoosePaginate);

mongoose.set("strictQuery", false);

const ProductModel = mongoose.model(productsCollection, productSchema);

export default ProductModel;
