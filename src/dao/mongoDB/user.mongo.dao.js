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
		return await this.model.findById(userId).lean();
	}

	//método para registrar un usuario
	async createUser(newUser) {
		let newCartId = await cartDAO.addNewCart();
		newUser.cartId = newCartId;
		return await this.model.create(newUser);
	}

	//Método para actualizar producto
	async updateUser(newUser) {
		await this.model.updateOne({ email: newUser.email }, newUser);
	}

	//Método para eliminar un usuario
	async deleteUser(userId) {
		return this.model.deleteOne({ _id: userId }); //elimino producto seleccionado
	}

	//Método para eliminar varios usuario
	async deleteManyUser(idsToDelete) {
		return this.model.deleteMany({ _id: { $in: idsToDelete } }); //elimino producto seleccionado
	}
}

//instancio nueva clase de User Mongo
const userMongo = new UserMongo();
export default userMongo;
