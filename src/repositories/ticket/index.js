import { ticketDAO } from '../../dao/factory.js';
import TicketRepository from './ticket.repository.js';

export const TicketService = new TicketRepository(ticketDAO);
