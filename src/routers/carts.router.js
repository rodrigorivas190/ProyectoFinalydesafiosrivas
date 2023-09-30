//Router de carritos
import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';
import { middlewarePassportJWT } from '../middleware/jwt.middleware.js';
import { isUser } from '../middleware/isUser.middleware.js';
import ticketController from '../controllers/ticket.controller.js';

import { generateAddProductToCartErrorInfo } from '../tools/info.js';
import EErrors from '../tools/EErrors.js';

const cartRouter = Router();

//Endpoint que agrega un nuevo carrito
cartRouter.post('/', async (req, res, next) => {
	
	try {
		await cartController.addNewCart();
		res.send({ status: 'sucess', message: 'New cart added' });
	} catch (error) {
		next(error);
	}
});

//Endpoint que muestra los productos de un carrito en particular
cartRouter.get('/:cid', async (req, res, next) => {
	
	try {
		//Recibo un params y muestro el listado de productos de un carrito determinado
		let products = await cartController.getCartById(req.params.cid);
		res.send(products);
	} catch (error) {
		next(error);
	}
});

//Endpoint que agrega el producto a un carrito determinado
cartRouter.post('/:cid/product/:pid', middlewarePassportJWT, isUser, async (req, res, next) => {
	
	try {
		let cartId = req.params.cid;
		let productId = req.params.pid;
		if (!cartId || !productId) {
			CustomError.createError({
				name: 'Adding product to cart error',
				cause: generateAddProductToCartErrorInfo({ cartId, productId }),
				message: 'Error trying to add product to cart',
				code: EErrors.INVALID_TYPES_ERROR,
			});
		}
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let product = await cartController.addProductToCart(cartId, productId);
		res.send(product);
	} catch (error) {
		next(error);
	}
});

//Endpoint para borrar un producto del carrito
cartRouter.delete('/:cid/product/:pid', async (req, res, next) => {
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let product = await cartController.deleteProduct(req.params.cid, req.params.pid);
		res.send(product);
	} catch (error) {
		next(error);
	}
});

//Endpoint para actualizar los productos completos de un carrito
cartRouter.put('/:cid', async (req, res, next) => {
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let result = await cartController.updateAllProducts(req.params.cid, req.body);
		res.send(result);
	} catch (error) {
		next(error);
	}
});

//Endpoint para actualizar as cantidades de un producto dentro de un determinado carrito
cartRouter.put('/:cid/product/:pid', async (req, res, next) => {
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let result = await cartController.updateProductQuantity(req.params.cid, req.params.pid, req.body);
		res.send(result);
	} catch (error) {
		next(error);
	}
});

//Endpoint para borrar todos los productos del carrito
cartRouter.delete('/:cid', async (req, res, next) => {
	try {
		//Recibo por params el Id de carrito
		let product = await cartController.deleteAllProducts(req.params.cid);
		res.send(product);
	} catch (error) {
		next(error);
	}
});

//Endpoint para obtener el ticket de compra
cartRouter.post('/:cid/purchase', async (req, res, next) => {
	try {
		const cartId = req.params.cid;
		const { email } = req.body;
		let result = await ticketController.createTicket(cartId, email);
		res.send(result);
	} catch (error) {
		next(error);
	}
});

export { cartRouter };
