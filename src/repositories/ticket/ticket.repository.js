import TicketDTO from '../../dto/ticket.dto.js';

//en esta capa se pueden agregar los DTOs
export default class TicketRepository {
	constructor(dao) {
		this.dao = dao;
	}

	//Método para crear ticket
	async createTicket(newTicket) {
		let ticketToInsert = new TicketDTO(newTicket);
		return await this.dao.createTicket(ticketToInsert);
	}

	//Método para adquirir un ticket especifico por ID
	async getTicketById(idBuscado) {
		return await this.dao.getTicketById(idBuscado);
	}

	//Método para eliminar un ticket
	async deleteTicket(idBuscado) {
		return this.dao.deleteTicket(idBuscado); //elimino producto seleccionado
	}
}
