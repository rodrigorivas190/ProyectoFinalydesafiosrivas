//importación de service.
import MessageService from '../service/message.service.js';

class MessageController {
	constructor() {
		this.service = new MessageService();
	}

	//Método para traer todos los mensajes de la base de datos
	async getMessages() {
		return await this.service.getMessages();
	}

	//Método para agregar mensajes a la base de datos
	async addMessage(messageToAdd) {
		if (!messageToAdd.user || !messageToAdd.message) {
			return { error: 'Error: fields missing' }; //Si falta algun campo, arrojo error
		}

		await this.service.addMessage(messageToAdd);
		return { status: 'sucess', message: `message added to DB` };
	}
}

//Instancio una nueva clase de Message Controller
const messageController = new MessageController();

export default messageController;
