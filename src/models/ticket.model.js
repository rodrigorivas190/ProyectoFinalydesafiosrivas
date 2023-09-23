import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
	code: String,
	purchase_datetime: String,
	amount: Number,
	purchaser: String,
});

export const TicketModel = mongoose.model('tickets', ticketSchema);
