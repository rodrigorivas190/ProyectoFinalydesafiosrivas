//Router de carritos
import { Router } from 'express';
import CartManager from '../dao/service/CartManager.js';
import CartListDb from '../dao/service/Cart.service.js';

const cartRouter = Router();

//Instancio una nueva clase de Cart Manager con el archivo ya creado
const CartList = new CartManager('./carrito.json');


cartRouter.get("/", async (req, res) => {
	try {
	  const carts = await CartListDb.getCarts();
	  console.log(carts);
	  res.status(200).json(carts);
	} catch (err) {
	  res.status(400).json({ error400: "Bad Request" });
	}
  });
//Endpoint que agrega un nuevo carrito
cartRouter.post('/', async (req, res) => {
	
	try {
		CartListDb.addNewCart();
		res.status(200).json("A new cart was created");
		// res.send({ status: 'sucess', message: 'New cart added' });
	} catch (error) {
		// res.status(400).send(error);
		res.status(400).json({ error400: "Error creating cart" });
	}
});

//Endpoint que muestra los productos de un carrito en particular
cartRouter.get('/:cid', async (req, res) => {
	
	try {
		//Recibo un params y muestro el listado de productos de un carrito determinado
		let products = await CartListDb.getCartById(req.params.cid);
		res.send(products);
	} catch (err) {
		if (err.message.includes("Cart with id")) {
		  res.status(404).json({ error404: err.message });
		}
	  }
	
	
});

//Endpoint que agrega el producto a un carrito determinado
cartRouter.post('/:cid/product/:pid', async (req, res) => {
	
	try {
		//Recibo por params el Id de carrito y el ID del producto y lo agrego al carrito indicado
		let product = await CartListDb.addProductToCart(req.params.cid, req.params.pid);
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
		let product = await CartListDb.deleteProduct(req.params.cid, req.params.pid);
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
		let product = await CartListDb.deleteCart(req.params.cid);
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

export { cartRouter, CartList };
