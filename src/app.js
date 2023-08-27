import MongoStore from 'connect-mongo';
import path from 'path';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import express from 'express';

import { productsRouter } from './routers/products.router.js';
import { cartRouter } from './routers/carts.router.js';
import handlebars from 'express-handlebars';
import __dirname from './dirname.util.js';
import { viewsRouter } from './routers/views.router.js';
import ProductListDb from './dao/service/Product.service.js';
import MessageListDb from './dao/service/Message.service.js';
import { messagesRouter } from './routers/message.router.js';
import usersRouter from './routers/user.router.js';
import initializePassport from './config/passport.config.js';
import { sessionRouter } from './routers/sessions.router.js';
import config from './config/config.js';

//Inicializo Express
const app = express();

//Monto el servidor en el puerto 8080

const webServer = app.listen(config.port, () => {
	console.log(`✅ Server running at port ${config.port}`);
});


app.engine('handlebars', handlebars.engine()); 
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'handlebars'); 


app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("../src/public")); 

// Session
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: config.mongoUrl,
			dbName: config.dbName,
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
			
			ttl: 1000,
		}),
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
);

app.use(cookieParser('B2zdY3B$pHmxW%'));
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

const messages = [];


const io = new Server(webServer);


const newMessage = {
	user: '',
	message: '',
};


io.on('connection', async (socket) => {
	//cuando se conecta un cliente le envío el listado de productos
	socket.emit('real_time_products', await ProductListDb.getProducts());
	
	socket.emit('messages', messages);

	
	socket.on('message', async (message) => {
		newMessage.user = message.user; 
		newMessage.message = message.msj;
		await MessageListDb.addMessage(newMessage); 
		
		messages.push(message);
		
		io.emit('messages', messages);
	});
});

//Me conecto a la base de datos

mongoose
  .connect(config.mongoUrl, {
    dbName: config.dbName,
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

