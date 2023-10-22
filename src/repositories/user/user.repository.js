//en esta capa se pueden agregar los DTOs
import UserDTO from '../../dto/user.dto.js';

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
	async createUser(newUser) {
		let userToInsert = new UserDTO(newUser);
		return await this.dao.createUser(userToInsert);
	}

	//método para actualizar un usuario
	async updateUser(newUser) {
		await this.dao.updateUser(newUser);
	}

	//Método para eliminar un usuario
	async deleteUser(userId) {
		return this.dao.deleteUser(userId); //elimino producto seleccionado
	}

	//Método para eliminar varios usuario
	async deleteManyUser(idsToDelete) {
		return this.dao.deleteManyUser(idsToDelete); //elimino producto seleccionado
	}
}
