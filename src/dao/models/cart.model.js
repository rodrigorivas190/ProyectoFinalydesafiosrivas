//Modelo de carritos para guardar en la base de datos
import mongoose from 'mongoose';

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
});

export const CartModel = mongoose.model('carts', cartSchema);
