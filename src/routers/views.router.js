import { Router } from 'express';
import { io } from '../app.js';
import ProductListDb from '../dao/service/Product.service.js';
import CartListDb from '../dao/service/Cart.service.js';
import { isAuth, isGuest } from '../public/middleware/auth.middleware.js';
import { middlewarePassportJWT } from '../public/middleware/jwt.middleware.js';

//Inicializo Router
const viewsRouter = Router();

//Endpoint que muestra los produuctos
viewsRouter.get('/products', middlewarePassportJWT, async (req, res) => {
	let { user } = req.user;
	delete user.password;
	try {
		const { limit, page, category, availability, sort } = req.query;
		let products = await ProductListDb.getProducts(parseInt(limit), parseInt(page), category, sort, availability); //traigo el listado de productos y los renderizo en home
		//let showProducts = products.payload;
		res.render('home', {
			products,
			user,
			style: 'index.css', // Envío los estilos css
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que muestra los productos en tiempo real
viewsRouter.get('/realtimeproducts', async (req, res) => {
	io.emit('real_time_products', await ProductListDb.getProducts());
	try {
		res.render('realTimeProducts', {
			//renderizo los productos en tiempo real
			style: 'index.css', // Envío los estilos css
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que muestra los mensajes
viewsRouter.get('/chat', async (req, res) => {
	// Inicio la conección y envio el listado de productos para rederizarlos en pantalla
	/*io.on('connection', async (socket) => {
		//cuando se conecta un cliente le envío el listado de productos
		socket.emit('real_time_products', await ProductList.getProducts());
	});*/

	try {
		res.render('chat'); // Renderizo los mensajes en pantalla
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que muestra los produuctos de un carrito
viewsRouter.get('/carts/:cid', async (req, res) => {
	try {
		const cartId = req.params.cid;
		let products = await CartListDb.getCartById(cartId);
		res.render('cart', {
			products,
			cartId,
			style: 'index.css', // Envío los estilos css
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

viewsRouter.get('/registerok', async (req, res) => {
	try {
		res.render('registerok', {
			title: 'Registro correcto',
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que muestra la pantalla de login
viewsRouter.get('/login', isGuest, async (req, res) => {
	try {
		res.render('login', {
			style: 'index.css', // Envío los estilos css
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que muestra la pantalla de login
viewsRouter.get('/', async (req, res) => {
	try {
		res.redirect('/login');
	} catch (error) {
		res.status(400).send(error);
	}
});

export { viewsRouter };
