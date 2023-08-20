//Servicio de Mensajes
import { MessageModel } from '../models/message.model.js';

class MessageService {
	constructor() {
		this.model = MessageModel;
	}

	//Método para traer todos los mensajes de la base de datos
	async getMessages() {
		return await this.model.find().lean();
	}

	//Método para agregar mensajes a la base de datos
	async addMessage(messageToAdd) {
		if (!messageToAdd.user || !messageToAdd.message) {
			return { error: 'Error: fields missing' }; //Si falta algun campo, arrojo error
		}

		await this.model.create(messageToAdd);
		return { status: 'sucess', message: `message added to DB` };
	}
}

const MessageListDb = new MessageService();
export default MessageListDb;
