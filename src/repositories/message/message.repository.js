import MessageDTO from '../../dto/message.dto.js';

export default class MessageRepository {
	constructor(dao) {
		this.dao = dao;
	}

	//Método para traer todos los mensajes de la base de datos
	async getMessages() {
		return await this.dao.getMessages();
	}

	//Método para agregar mensajes a la base de datos
	async addMessage(messageToAdd) {
		let messageToInsert = new MessageDTO(messageToAdd);
		await this.dao.addMessage(messageToInsert);
	}
}
