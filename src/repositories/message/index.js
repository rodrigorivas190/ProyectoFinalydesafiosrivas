import { messageDAO } from '../../dao/factory.js';
import MessageRepository from './message.repository.js';

export const MessageService = new MessageRepository(messageDAO);
