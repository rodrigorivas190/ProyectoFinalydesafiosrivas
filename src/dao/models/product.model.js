//Modelo de productos para guardar en la base de datos
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
	title: {
		type: String,
		require: true,
	},
	description: {
		type: String,
		require: true,
	},
	code: {
		type: String,
		require: true,
		unique: true,
		index: true,
	},
	price: {
		type: Number,
		require: true,
	},
	status: {
		type: Boolean,
		require: true,
	},
	stock: {
		type: Number,
		require: true,
	},
	category: {
		type: String,
		require: true,
		index: true,
	},
	thumbnail: {
		type: Array,
		require: true,
	},
});
productSchema.plugin(mongoosePaginate);
export const ProductModel = mongoose.model('products', productSchema);
