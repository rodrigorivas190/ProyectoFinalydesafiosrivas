//importación de service.
import { UserService } from '../repositories/user/index.js';

class UserController {
	constructor() {
		this.service = UserService;
	}
	//método para traer todos los usuarios
	async getAll() {
		return await this.service.getAll();
	}

	//método para encontrar un usuario por mail
	async getByEmail(email) {
		return await this.service.getByEmail(email);
	}

	//método para encontrar un usuario por id
	async getById(userId) {
		return await this.service.getById(userId);
	}

	//método para registrar un usuario
	async createUser(userData) {
		return await this.service.createUser(userData);
	}
}

//Instancio una nueva clase de User Controller
const userController = new UserController();

export default userController;
