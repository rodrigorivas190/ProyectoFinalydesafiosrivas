//Imports generales
import express from 'express';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import __dirname from './dirname.util.js';
import handlebars from 'express-handlebars';

import { Server } from 'socket.io';

//import de rutas
import { productsRouter } from './routers/products.router.js';
import { cartRouter } from './routers/carts.router.js';
import { viewsRouter } from './routers/views.router.js';
import { messagesRouter } from './routers/message.router.js';
import usersRouter from './routers/user.router.js';
import { sessionRouter } from './routers/sessions.router.js';
import { mailRouter } from './routers/mail.router.js';

//Import de passport
import initializePassport from './config/passport.config.js';

//import de environment
import environment from './config/environment.js';

//import de controllers
import productController from './controllers/product.controller.js';
import messageController from './controllers/message.controller.js';

//Inicializo Express
const app = express();

//Monto el servidor en el puerto 8080
const webServer = app.listen(environment.port, () => {
	console.log(`✅ Server running at port ${environment.port}`);
});

//Handlebars
app.engine('handlebars', handlebars.engine()); 
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'handlebars'); 

//seteamos de manera estatica la carpeta public
app.use(express.static(path.join(__dirname, 'public')));


//Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use("/static", express.static("/src/public")); 
//Session
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URL,
			dbName: process.env.DB_NAME,
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
			
			ttl: 1000,
		}),
		secret: process.env.KEY_SESSION,
		resave: true,
		saveUninitialized: true,
	})
);
app.use(cookieParser(process.env.COOKIE_HASH));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Definición de rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/users', usersRouter);
app.use('/', viewsRouter);
app.use('/messages', messagesRouter);
app.use('/email', mailRouter);

const messages = [];

// Inicialización de socket.io
const io = new Server(webServer);

//Estructura de mensaje para guardar en la base de datos
const newMessage = {
	user: '',
	message: '',
};

// Inicio la conección y envio el listado de productos para rederizarlos en pantalla
io.on('connection', async (socket) => {
	//cuando se conecta un cliente le envío el listado de productos
	socket.emit('real_time_products', await productController.getProducts());
	// Envio los mensajes al cliente que se conectó
	socket.emit('messages', messages);

	// Escucho los mensajes enviado por el cliente y se los propago a todos
	socket.on('message', async (message) => {
		newMessage.user = message.user; //recibo el mensaje enviado por el cliente y su usuario
		newMessage.message = message.msj;
		await messageController.addMessage(newMessage); //Lo guardo en la base de datos
		// Agrego el mensaje al array de mensajes
		messages.push(message);
		// Propago el evento a todos los clientes conectados
		io.emit('messages', messages);
	});
});



mongoose
  .connect(process.env.MONGO_URL, {
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
export { io };

