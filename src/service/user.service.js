import { userDAO } from '../dao/factory.js';
import UserRepository from '../repositories/user.repository.js';

export default class UserService {
	constructor() {
		this.repository = new UserRepository(userDAO);
	}
	//método para traer todos los usuarios
	async getAll() {
		return await this.repository.getAll();
	}

	//método para encontrar un usuario por mail
	async getByEmail(email) {
		return await this.repository.getByEmail(email);
	}

	//método para encontrar un usuario por id
	async getById(userId) {
		return await this.repository.getById(userId);
	}

	//método para registrar un usuario
	async createUser(userData) {
		return await this.repository.createUser(userData);
	}
}
