import mongoose from 'mongoose';
import environment from '../config/environment.js';

//Exportacion de instancias
export let cartDAO;
export let messageDAO;
export let productDAO;
export let ticketDAO;
export let userDAO;

switch (environment.persistence) {
	case 'MONGO':
		//Me conecto a la base de datos
		mongoose
		.connect(environment.mongoUrl, {
			dbName: process.env.DB_NAME,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("DB connected");
		})
		.catch((e) => {
			console.log("Can't connect to DB");
		});

		//Importacion dinámica de los daos
		const { default: cartMongo } = await import('./mongoDB/cart.mongo.dao.js');
		const { default: messageMongo } = await import('./mongoDB/message.mongo.dao.js');
		const { default: productMongo } = await import('./mongoDB/product.mongo.dao.js');
		const { default: ticketMongo } = await import('./mongoDB/ticket.mongo.dao.js');
		const { default: userMongo } = await import('./mongoDB/user.mongo.dao.js');

		//asignacion de dao
		cartDAO = cartMongo;
		messageDAO = messageMongo;
		productDAO = productMongo;
		ticketDAO = ticketMongo;
		userDAO = userMongo;

		break;
	//se pueden agregar mas formas de persistencias de archivos agregando otro case
}
