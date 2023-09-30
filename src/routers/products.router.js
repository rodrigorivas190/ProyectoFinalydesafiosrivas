import { Router } from 'express';
import { io } from '../app.js';
import { middlewarePassportJWT } from '../middleware/jwt.middleware.js';
import { isAdmin } from '../middleware/isAdmin.middleware.js';

import productController from '../controllers/product.controller.js';
import CustomError from '../tools/CustomErrors.js';
import {
	generateAddProductErrorInfo,
	generateDeleteProductErrorInfo,
	generateDuplicatedProductErrorInfo,
	generateUpdateErrorInfo,
} from '../tools/info.js';
import EErrors from '../tools/EErrors.js';
//Inicializo Router
const productsRouter = Router();

//Endpoint que muestra todos los productos
productsRouter.get('/', async (req, res, next) => {
	const { limit, page, category, availability, sort } = req.query;
	try {
		let showProducts = await productController.getProducts(limit, page, category, sort, availability); //Traigo el listado de productos
		res.send(showProducts); //envio la respuesta
	} catch (error) {
		next(error);
	}
});

//Endpoint que muestra un producto en particular
productsRouter.get('/:pid', async (req, res, next) => {
	try {
		//Recibo un params y muestro el producto con ese ID, como el ID es un string lo paso a entero
		let product = await productController.getProductsById(req.params.pid);
		res.send(product);
	} catch (error) {
		next(error);
	}
});

//Endpoint que agrega un producto
productsRouter.post('/', middlewarePassportJWT, isAdmin, async (req, res, next) => {
	try {
		const productToAdd = req.body;
		if (
			!productToAdd.title ||
			!productToAdd.description ||
			!productToAdd.code ||
			!productToAdd.price ||
			!productToAdd.status ||
			!productToAdd.stock ||
			!productToAdd.category ||
			!productToAdd.thumbnail
		) {
			CustomError.createError({
				name: 'Product creation error',
				cause: generateAddProductErrorInfo(productToAdd),
				message: 'Error trying to create product',
				code: EErrors.INVALID_TYPES_ERROR,
			});
		}

		let newProduct = await productController.addProducts(productToAdd); //recibo por body el producto a agregar
		if (newProduct === EErrors.DUPLICATED_VALUE_ERROR) {
			CustomError.createError({
				name: 'Product creation error',
				cause: generateDuplicatedProductErrorInfo(productToAdd.code),
				message: 'Error trying to create product',
				code: EErrors.DUPLICATED_VALUE_ERROR,
			});
		}

		res.send(newProduct); //respondo con el producto agregado
	} catch (error) {
		next(error);
	}
});

//Endpoint que modifica un producto
productsRouter.put('/:pid', middlewarePassportJWT, isAdmin, async (req, res, next) => {
	try {
		let idBuscado = req.params.pid;
		if (!idBuscado) {
			CustomError.createError({
				name: 'Product updating error',
				cause: generateUpdateErrorInfo(idBuscado),
				message: 'Error trying to update product',
				code: EErrors.INVALID_TYPES_ERROR,
			});
		}
		let product = await productController.updateProduct(idBuscado, req.body); //recibo por body los datos modificados
		io.emit('real_time_products', await productController.getProducts());
		res.send(product);
	} catch (error) {
		next(error);
	}
});

//Endpoint que elimina un producto
productsRouter.delete('/:pid', middlewarePassportJWT, isAdmin, async (req, res, next) => {
	try {
		let idBuscado = req.params.pid;
		let product = await productController.deleteProduct(idBuscado);
		if (!product === EErrors.DELETE_ERROR) {
			CustomError.createError({
				name: 'Product Delete error',
				cause: generateDeleteProductErrorInfo(idBuscado),
				message: 'Error trying to update product',
				code: EErrors.DELETE_ERROR,
			});
		}

		io.emit('real_time_products', await productController.getProducts());
		res.send(product);
	} catch (error) {
		next(error);
	}
});

export { productsRouter };
