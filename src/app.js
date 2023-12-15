//Imports generales
import express from 'express';
import MongoStore from 'connect-mongo';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import __dirname from './dirname.util.js';
import handlebars from 'express-handlebars';
import cors from 'cors'; 

import { Server } from 'socket.io';

//import de rutas
import { productsRouter } from './routers/products.router.js';
import { cartRouter } from './routers/carts.router.js';
import { viewsRouter } from './routers/views.router.js';
import { messagesRouter } from './routers/message.router.js';
import { usersRouter } from './routers/user.router.js';
import { sessionRouter } from './routers/sessions.router.js';
import { mailRouter } from './routers/mail.router.js';
import { mockingRouter } from './routers/mocking.router.js';
import { loggerRouter } from './routers/logger.router.js';
import paymentRouter from './routers/payment.router.js';
import indexRoutes from './routers/payment.router.js';

//Import de passport
import initializePassport from './config/passport.config.js';

//import de environment
import environment from './config/environment.js';

//import de controllers
import productController from './controllers/product.controller.js';
import messageController from './controllers/message.controller.js';

//Middlewares
import errorsManagerMiddleware from './middleware/errorsManager.middleware.js';
import { addLogger, logger } from './middleware/logger.middleware.js'

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import mongoose from 'mongoose';

//Inicializo Express
const app = express();

//Monto el servidor en el puerto 8080
const webServer = app.listen(environment.port, () => {
	logger.info(`✅ Server running at port ${environment.port}`);
});

//configuración de SWAGGER
const swaggerOptions = {
	definition: {
	  openapi: '3.0.1',
	  info: {
		title: 'Documentación LiberiaLea',
		description: 'en la presente documentación se desarrollará todo lo necesario para dar a conocer lógica y demás aspectos de la API',
	  },
	  components: {
		securitySchemes: {
		  Authorization: {
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
			value: "Bearer <Secret>",
		  },
		},
	  },
	},
	apis: [`${__dirname}/docs/**/*.yaml`]
	
  };
  
  const specs = swaggerJsDoc(swaggerOptions);

//CORS
const corsOptions = {
	origin: 'http://localhost:8080', // Reemplaza con el origen permitido
	// origin: 'https://proyectofinalydesafiosrivas-production-f97c.up.railway.app',
	methods: 'GET,POST,PUT,DELETE',
	allowedHeaders: 'Content-Type, Authorization',
  };
  
  app.use(cors(corsOptions));

//Handlebars
app.engine('handlebars', handlebars.engine()); // Inicializamos el motor de plantillas de Handlebars
app.set('views', path.join(__dirname, 'views')); //indicamos ruta de las views
app.set('view engine', 'handlebars'); //por ultimo, se indica que vamos a utilizar el motor de Handlebars

//seteamos de manera estatica la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

//Middlewares
app.use(express.json()); //Middleware que facilita la conversión en formato json de lo que se reciba por body
app.use(express.urlencoded({ extended: true })); //Middleware para que express pueda reconover los objetos de las request como strings o arrays
app.use("/static", express.static("/src/public")); 
// app.use(express.static(path.resolve("src/public")));
// app.use(express.urlencoded({ extended: false }));
//Session
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: environment.mongoUrl,
			dbName: process.env.DB_NAME,
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
			ttl: 6000,
		}),
		secret: environment.mongoSessionSecret,
		resave: true,
		saveUninitialized: true,
	})
);
app.use(cookieParser(environment.cookieHash));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(errorsManagerMiddleware);
app.use(addLogger);
app.use(cors())

//Definición de rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/users', usersRouter);
app.use('/', viewsRouter);
app.use('/messages', messagesRouter);
app.use('/email', mailRouter);
app.use('/mockingproducts', mockingRouter);
app.use('/loggerTest', loggerRouter);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/api/payment", paymentRouter)
app.use(indexRoutes);

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

//Me conecto a la base de datos
mongoose.connect(environment.mongoUrl);





export { io };


// generarIdUnico1 = () => { 
//     return Math.random().toString(30).substring(2);           
// } 


