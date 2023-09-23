import { messageDAO } from '../dao/factory.js';
import MessageRepository from '../repositories/message.repository.js';

//Servicio de Mensajes
export default class MessageService {
	constructor() {
		this.repository = new MessageRepository(messageDAO);
	}

	//Método para traer todos los mensajes
	async getMessages() {
		return await this.repository.getMessages();
	}

	//Método para agregar mensajes
	async addMessage(messageToAdd) {
		await this.repository.addMessage(messageToAdd);
	}
}
