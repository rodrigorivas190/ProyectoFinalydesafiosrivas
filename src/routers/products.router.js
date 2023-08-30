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
	
	try {
		//Recibo un params y muestro el producto con ese ID, como el ID es un string lo paso a entero
		let product = await ProductListDb.getProductsById(req.params.pid);
		
		if ('error' in product) {
            // Si hay un error en el objeto product, envía el mensaje de error
            return res.status(404).json({ message: product.error });
        }

        res.send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Endpoint que agrega un producto
productsRouter.post('/', async (req, res) => {
	
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
	
	try {
		let product = await ProductListDb.deleteProduct(req.params.pid);
		io.emit('real_time_products', await ProductListDb.getProducts()); //propago el evento a todos los clientes
		res.send(product);
	} catch (error) {
		res.status(400).send(error);
	}
});

export { productsRouter, ProductList };
