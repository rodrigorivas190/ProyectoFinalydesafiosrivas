import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: Array,
    default: [] 
  },
  code: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true 
  }
});
productSchema.plugin(mongoosePaginate);

mongoose.set("strictQuery", false);

const ProductModel = mongoose.model(productsCollection, productSchema);

export default ProductModel;
