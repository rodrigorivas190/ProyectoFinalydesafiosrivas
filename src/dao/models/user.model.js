import mongoose from 'mongoose';
import { CartModel } from './cart.model.js';

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
		type: mongoose.ObjectId,
		ref: 'CartModel',
	},
	role: {
		type: String,
		default: 'user',
	},
});

const userModel = mongoose.model('users', userSchema);


export default userModel;
