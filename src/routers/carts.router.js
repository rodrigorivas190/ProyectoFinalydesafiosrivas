//Router de carritos
import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';
import { middlewarePassportJWT } from '../middleware/jwt.middleware.js';
import { isUser } from '../middleware/isUser.middleware.js';
import ticketController from '../controllers/ticket.controller.js';

const cartRouter = Router();


//Endpoint que agrega un nuevo carrito
cartRouter.post('/', async (req, res) => {
	
	try {
		await cartController.addNewCart();
		res.send({ status: 'sucess', message: 'New cart added' });
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que muestra los productos de un carrito en particular
cartRouter.get('/:cid', async (req, res) => {
	
	try {
		//Recibo un params y muestro el listado de productos de un carrito determinado
		let products = await cartController.getCartById(req.params.cid);
		res.send(products);
		if (!products || products.length === 0) {
            // Si no se encontró el carrito o está vacío, devuelve un mensaje de error
            return res.status(404).json({ message: 'No existe el carrito con el ID especificado.' });
        }

        res.send(products);
    } catch (err) {
        if (err.message.includes("Cart with id")) {
            res.status(404).json({ error404: err.message });
        }
    }
});

//Endpoint que agrega el producto a un carrito determinado
cartRouter.post('/:cid/product/:pid', middlewarePassportJWT, isUser, async (req, res) => {
	
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let product = await cartController.addProductToCart(req.params.cid, req.params.pid);
		res.send(product);
	} catch (err) {
		if (err.message.includes("Cart with id")) {
		  res.status(404).json({ error404: err.message });
		}
	}
});

//Endpoint para borrar un producto del carrito
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let product = await cartController.deleteProduct(req.params.cid, req.params.pid);
		res.send(product);
	} catch (err) {
		if (err.message.includes("Cart with")) {
		  res.status(404).json({ error400: err.message });
		}
		if (err.message.includes("Product with")) {
		  res.status(404).json({ error400: err.message });
		}
	}
});

//Endpoint para actualizar los productos completos de un carrito
cartRouter.put('/:cid', async (req, res) => {
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let result = await cartController.updateAllProducts(req.params.cid, req.body);
		res.send(result);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint para actualizar as cantidades de un producto dentro de un determinado carrito
cartRouter.put('/:cid/product/:pid', async (req, res) => {
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let result = await cartController.addProductToCart(req.params.cid, req.params.pid, req.body);
		res.send(result);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint para borrar todos los productos del carrito
cartRouter.delete('/:cid', async (req, res) => {
	try {
		//Recibo por params el Id de carrito
		let product = await cartController.deleteAllProducts(req.params.cid);
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint para obtener el ticket de compra
cartRouter.post('/:cid/purchase', async (req, res) => {
	try {
		const cartId = req.params.cid;
		const { email } = req.body;
		let result = await ticketController.createTicket(cartId, email);
		res.send(result);
	} catch (error) {
		res.status(400).send(error);
	}
});

export { cartRouter };
