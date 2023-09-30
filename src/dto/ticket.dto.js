export default class TicketDTO {
	constructor(newTicket) {
		this.code = newTicket.code;
		this.purchase_datetime = newTicket.purchase_datetime;
		this.amount = newTicket.amount;
		this.purchaser = newTicket.purchaser;
	}
}
