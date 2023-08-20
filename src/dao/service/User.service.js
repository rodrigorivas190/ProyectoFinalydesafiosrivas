import userModel from '../models/user.model.js';

class UserService {
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
		return await this.model.create(userData);
	}
}

const userService = new UserService();
export default userService;
