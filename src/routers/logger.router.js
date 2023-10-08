import { Router } from 'express';


const loggerRouter = Router();

//importación de libreria de dating
import { DateTime } from 'luxon';

//Endpoint que muestra los mensajes
loggerRouter.get('/', async (req, res, next) => {
	const dateTime = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
	try {
		req.logger.fatal(`${dateTime} - Log de Fatal`);
		req.logger.warning(`${dateTime} - Log de Warning`);
		req.logger.info(`${dateTime} - Log de Info`);
		req.logger.http(`${dateTime} - Log de Http`);
		req.logger.debug(`${dateTime} - Log de Debug`);
		req.logger.error(`${dateTime} - Log de Error `);

		res.send('Prueba de logs OK');
	} catch (error) {
		next(error);
	}
});

export { loggerRouter };
