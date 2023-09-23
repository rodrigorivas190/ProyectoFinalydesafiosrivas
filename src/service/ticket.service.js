import { ticketDAO } from '../dao/factory.js';
import TicketRepository from '../repositories/ticket.repository.js';

export default class TicketService {
	constructor() {
		this.repository = new TicketRepository(ticketDAO);
	}

	//Método para agregar un nuevo ticket
	async createTicket(newTicket) {
		return await this.repository.createTicket(newTicket);
	}

	//Método para adquirir un ticket especifico por ID
	async getTicketById(idBuscado) {
		return await this.repository.getTicketById(idBuscado);
	}

	//Método para eliminar un producto
	async deleteTicket(idBuscado) {
		return this.repository.deleteTicket(idBuscado);
	}
}
