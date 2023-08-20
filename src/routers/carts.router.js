//Router de carritos
import { Router } from 'express';
import CartManager from '../dao/service/CartManager.js';
import CartListDb from '../dao/service/Cart.service.js';

const cartRouter = Router();

//Instancio una nueva clase de Cart Manager con el archivo ya creado
const CartList = new CartManager('./carrito.json');

//Endpoint que agrega un nuevo carrito
cartRouter.post('/', async (req, res) => {
	/*try {
		CartList.addNewCart();
		res.send({ status: 'sucess', message: 'New cart added' });
	} catch (error) {
		res.status(400).send(error);
	}*/
	try {
		CartListDb.addNewCart();
		res.send({ status: 'sucess', message: 'New cart added' });
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que muestra los productos de un carrito en particular
cartRouter.get('/:cid', async (req, res) => {
	/*try {
		//Recibo un params y muestro el producto con ese ID, como el ID es un string lo paso a entero
		let products = await CartList.getCartById(parseInt(req.params.cid));
		res.send(products);
	} catch (error) {
		res.status(400).send(error);
	}*/
	try {
		//Recibo un params y muestro el listado de productos de un carrito determinado
		let products = await CartListDb.getCartById(req.params.cid);
		res.send(products);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que agrega el producto a un carrito determinado
cartRouter.post('/:cid/product/:pid', async (req, res) => {
	/*try {
		//Recibo un params y muestro el producto con ese ID, como el ID es un string lo paso a entero
		let product = await CartList.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}*/
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let product = await CartListDb.addProductToCart(req.params.cid, req.params.pid);
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint para borrar un producto del carrito
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let product = await CartListDb.deleteProduct(req.params.cid, req.params.pid);
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint para actualizar los productos completos de un carrito
cartRouter.put('/:cid', async (req, res) => {
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let result = await CartListDb.updateAllProducts(req.params.cid, req.body);
		res.send(result);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint para actualizar as cantidades de un producto dentro de un determinado carrito
cartRouter.put('/:cid/product/:pid', async (req, res) => {
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let result = await CartListDb.updateProductQuantity(req.params.cid, req.params.pid, req.body);
		res.send(result);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint para borrar todos los productos del carrito
cartRouter.delete('/:cid', async (req, res) => {
	try {
		//Recibo por params el Id de carrito
		let product = await CartListDb.deleteAllProducts(req.params.cid);
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

export { cartRouter, CartList };
