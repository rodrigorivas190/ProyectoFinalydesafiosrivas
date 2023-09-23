import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		unique: true,
		required: true,
		index: true,
	},
	age: Number,
	password: String,
	cartId: {
		type: mongoose.Schema.Types.ObjectId, //id de carrito asignado
		ref: 'carts',
	},
	role: {
		type: String,
		default: 'user',
	},
});

const userModel = mongoose.model('users', userSchema);

export default userModel;
