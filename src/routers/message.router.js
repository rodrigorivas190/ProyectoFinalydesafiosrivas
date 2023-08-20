import { Router } from 'express';
import MessageListDb from '../dao/service/Message.service.js';

const messagesRouter = Router();

//Endpoint que muestra los mensajes
messagesRouter.get('/', async (req, res) => {
	try {
		res.send(await MessageListDb.getMessages()); // Adquiero todos los mensajes y los retorno
	} catch (error) {
		res.status(400).send(error);
	}
});

export { messagesRouter };
