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
// import config from './config/config.js';

//Inicializo Express
const app = express();

const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, (req, res) => {
	console.log(` ✅ Server running at port: ${PORT}`);
  });


app.engine('handlebars', handlebars.engine()); 
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'handlebars'); 


app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("../src/public")); 

const URL =
  "mongodb+srv://rodrigorivas190:Maxi7774@cluster0.rp3vhne.mongodb.net/?retryWrites=true&w=majority";

app.use(
	session({
	  store: MongoStore.create({
		mongoUrl: URL,
		dbName: "libreriaLea",
		mongoOptions: {
		  useNewUrlParser: true,
		  useUnifiedTopology: true,
		},
		ttl: 1000,
	  }),
	  secret: "secret",
	  resave: true,
	  saveUninitialized: true,
	})
  );

app.use(cookieParser('B2zdY3B$pHmxW%'));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(URL, {
    dbName: "libreriaLea",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => {
    console.log("Can't connect to DB");
  });
//Definición de rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/users', usersRouter);
app.use('/', viewsRouter);
app.use('/messages', messagesRouter);

const messages = [];


const io = new Server(httpServer);


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



export { io };

