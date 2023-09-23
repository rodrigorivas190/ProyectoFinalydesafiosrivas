import { Router } from 'express';
import messageController from '../controllers/message.controller.js';

const messagesRouter = Router();

//Endpoint que muestra los mensajes
messagesRouter.get('/', async (req, res) => {
	try {
		res.send(await messageController.getMessages()); // Adquiero todos los mensajes y los retorno
	} catch (error) {
		res.status(400).send(error);
	}
});

export { messagesRouter };
