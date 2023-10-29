//importación de service.
import { MessageService } from '../repositories/message/index.js';
import { logger } from '../middleware/logger.middleware.js';

class MessageController {
  constructor() {
    this.service = MessageService;
  }

  // Método para traer todos los mensajes de la base de datos
  async getMessages(req, res) {
    try {
      const messages = await this.service.getMessages();
      res.status(200).json(messages);
    } catch (error) {
      logger.error(`Error getting messages: ${error}`);
      throw new Error('Internal server error');
    }
  }

  // Método para agregar mensajes a la base de datos
  async addMessage(req, res) {
    try {
      const messageToAdd = req.body;

      if (!messageToAdd.user || !messageToAdd.message) {
        return res.status(400).json({ error: 'Error: fields missing' });
      }

      await this.service.addMessage(messageToAdd);
      res.status(201).json({ status: 'success', message: `Message added to DB` });
    } catch (error) {
      logger.error(`Error adding a message: ${error}`);
      throw new Error('Internal server error');
    }
  }
}
//Instancio una nueva clase de Message Controller
const messageController = new MessageController();

export default messageController;
