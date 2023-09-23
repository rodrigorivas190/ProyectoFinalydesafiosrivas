//importo modelo
import userModel from '../../models/user.model.js';

//importo el dao para utilizar metodos del carrito
import cartDAO from './cart.mongo.dao.js';

class UserMongo {
	constructor() {
		this.model = userModel;
	}
	//método para traer todos los usuarios
	async getAll() {
		return await this.model.find();
	}

	//método para encontrar un usuario por mail
	async getByEmail(email) {
		return await this.model.findOne({ email: email });
	}

	//método para encontrar un usuario por id
	async getById(userId) {
		return await this.model.findById(userId);
	}

	//método para registrar un usuario
	async createUser(userData) {
		let newCartId = await cartDAO.addNewCart();
		userData.cartId = newCartId;
		return await this.model.create(userData);
	}
}

//instancio nueva clase de User Mongo
const userMongo = new UserMongo();
export default userMongo;
