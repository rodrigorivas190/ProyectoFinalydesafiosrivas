import { Router } from 'express';
import ProductManager from '../dao/service/ProductManager.js';
import { io } from '../app.js';
import ProductListDb from '../dao/service/Product.service.js';

//Inicializo Router
const productsRouter = Router();

//Instancio una nueva clase de Product Manager con el archivo ya creado
const ProductList = new ProductManager('./productos.json');

//Endpoint que muestra todos los productos
productsRouter.get('/', async (req, res) => {
	/*try {
		let allProducts = await ProductList.getProducts();
		let limit = req.query.limit;
		if (limit) {
			// Si recibo el limite de productos a mostrar
			let productLimit = allProducts.slice(0, limit); //Solo muestro desde el primer elemento al limite indicado por query
			res.send(productLimit); //envio la respuesta
		} else res.send(allProducts); // Si no tengo query envio el listado completo
	} catch (error) {
		res.status(400).send(error);
	}*/

	const { limit, page, category, availability, sort } = req.query;
	try {
		let showProducts = await ProductListDb.getProducts(limit, page, category, sort, availability); //Traigo el listado de productos
		res.send(showProducts); //envio la respuesta
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que muestra un producto en particular
productsRouter.get('/:pid', async (req, res) => {
	/*try {
		//Recibo un params y muestro el producto con ese ID, como el ID es un string lo paso a entero
		let product = await ProductList.getProductsById(parseInt(req.params.pid));
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}*/
	try {
		//Recibo un params y muestro el producto con ese ID, como el ID es un string lo paso a entero
		let product = await ProductListDb.getProductsById(req.params.pid);
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que agrega un producto
productsRouter.post('/', async (req, res) => {
	/*try {
		let newProduct = await ProductList.addProducts(req.body); //recibo por body el producto a agregar
		io.emit('real_time_products', await ProductList.getProducts()); //propago el evento a todos los clientes
		res.send(newProduct); //respondo con el producto agregado
	} catch (error) {
		res.status(400).send(error);
	}*/
	try {
		let newProduct = await ProductListDb.addProducts(req.body); //recibo por body el producto a agregar
		//io.emit('real_time_products', await ProductListDb.getProducts()); //propago el evento a todos los clientes
		res.send(newProduct); //respondo con el producto agregado
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que modifica un producto
productsRouter.put('/:pid', async (req, res) => {
	/*try {
		let productUpdated = req.body; //recibo por body los datos modificados
		let product = await ProductList.updateProduct(parseInt(req.params.pid), productUpdated);
		io.emit('real_time_products', await ProductList.getProducts()); //propago el evento a todos los clientes
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}*/

	try {
		let product = await ProductListDb.updateProduct(req.params.pid, req.body); //recibo por body los datos modificados
		io.emit('real_time_products', await ProductListDb.getProducts()); //propago el evento a todos los clientes
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que elimina un producto
productsRouter.delete('/:pid', async (req, res) => {
	/*try {
		let product = await ProductList.deleteProduct(parseInt(req.params.pid));
		io.emit('real_time_products', await ProductList.getProducts()); //propago el evento a todos los clientes
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}*/
	try {
		let product = await ProductListDb.deleteProduct(req.params.pid);
		io.emit('real_time_products', await ProductListDb.getProducts()); //propago el evento a todos los clientes
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

export { productsRouter, ProductList };
