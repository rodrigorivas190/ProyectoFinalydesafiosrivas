//Modelo de carritos para guardar en la base de datos
import mongoose from 'mongoose';
const cartsCollection = "carts";
const cartSchema = new mongoose.Schema({
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId, //Id de producto
				ref: 'products',
			},
			quantity: Number,
		},
	],
	default: [],
});
cartSchema.pre("find", function () {
	this.populate("products.product");
  });
  
  cartSchema.pre("findOne", function () {
	this.populate("products.product");
  });

export const CartModel = mongoose.model('carts', cartSchema, cartsCollection);
