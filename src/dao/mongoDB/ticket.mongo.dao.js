//Importp modelo
import { TicketModel } from '../../models/ticket.model.js';

class TicketMongo {
	constructor() {
		this.model = TicketModel;
	}

	//Método para crear un n uevo ticket
	async createTicket(newTicket) {
		return (await this.model.create(newTicket))._id;
	}

	//Método para adquirir un ticket especifico por ID
	async getTicketById(idBuscado) {
		return await this.model.findById(idBuscado).lean();
	}

	//Método para eliminar un ticket
	async deleteTicket(idBuscado) {
		return this.model.deleteOne({ _id: idBuscado });
	}
}

//Instancio una nueva clase de Ticket Mongo
const ticketMongo = new TicketMongo();

export default ticketMongo;
