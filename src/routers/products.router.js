import { Router } from 'express';
import { io } from '../app.js';
import { middlewarePassportJWT } from '../middleware/jwt.middleware.js';
import { isAdmin } from '../middleware/isAdmin.middleware.js';

import productController from '../controllers/product.controller.js';
//Inicializo Router
const productsRouter = Router();

//Endpoint que muestra todos los productos
productsRouter.get('/', async (req, res) => {
	
	const { limit, page, category, availability, sort } = req.query;
	try {
		let showProducts = await productController.getProducts(limit, page, category, sort, availability); //Traigo el listado de productos
		res.send(showProducts); //envio la respuesta
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que muestra un producto en particular
productsRouter.get('/:pid', async (req, res) => {

	try {
		//Recibo un params y muestro el producto con ese ID, como el ID es un string lo paso a entero
		let product = await productController.getProductsById(req.params.pid);
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que agrega un producto
productsRouter.post('/', middlewarePassportJWT, isAdmin, async (req, res) => {
	
	try {
		let newProduct = await productController.addProducts(req.body); //recibo por body el producto a agregar
		//io.emit('real_time_products', await ProductListDb.getProducts()); //propago el evento a todos los clientes
		res.send(newProduct); //respondo con el producto agregado
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que modifica un producto
productsRouter.put('/:pid', middlewarePassportJWT, isAdmin, async (req, res) => {
	

	try {
		let product = await productController.updateProduct(req.params.pid, req.body); //recibo por body los datos modificados
		io.emit('real_time_products', await productController.getProducts());
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que elimina un producto
productsRouter.delete('/:pid', middlewarePassportJWT, isAdmin, async (req, res) => {
	
	try {
		let product = await productController.deleteProduct(req.params.pid);
		io.emit('real_time_products', await productController.getProducts());
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

export { productsRouter };
