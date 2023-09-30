//en esta capa se pueden agregar los DTOs
export default class UserRepository {
	constructor(dao) {
		this.dao = dao;
	}
	//método para traer todos los usuarios
	async getAll() {
		return await this.dao.getAll();
	}

	//método para encontrar un usuario por mail
	async getByEmail(email) {
		return await this.dao.getByEmail(email);
	}

	//método para encontrar un usuario por id
	async getById(userId) {
		return await this.dao.getById(userId);
	}

	//método para registrar un usuario
	async createUser(userData) {
		return await this.dao.createUser(userData);
	}
}
