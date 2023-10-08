import { Router } from 'express';
import { io } from '../app.js';
import { isGuest } from '../middleware/auth.middleware.js';
import { middlewarePassportJWT } from '../middleware/jwt.middleware.js';
import productController from '../controllers/product.controller.js';
import cartController from '../controllers/cart.controller.js';
import { isUser } from '../middleware/isUser.middleware.js';

//Inicializo Router
const viewsRouter = Router();

//Endpoint que muestra los produuctos
viewsRouter.get('/products', middlewarePassportJWT, async (req, res) => {
	let { user } = req.user;
	delete user.password;
	try {
		const { limit, page, category, availability, sort } = req.query;
		let products = await productController.getProducts(parseInt(limit), parseInt(page), category, sort, availability); //traigo el listado de productos y los renderizo en home
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
	io.emit('real_time_products', await productController.getProducts());
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
viewsRouter.get('/chat', middlewarePassportJWT, isUser, async (req, res) => {
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
		let products = await cartController.getCartById(cartId);
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
