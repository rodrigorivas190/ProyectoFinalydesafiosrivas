import { Router } from 'express';
import { io } from '../app.js';
import { middlewarePassportJWT } from '../middleware/jwt.middleware.js';
import { isAdmin } from '../middleware/isAdmin.middleware.js';
import { isAdminOrPremium } from '../middleware/isAdminOrPremium.middleware.js';

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
productsRouter.post('/', middlewarePassportJWT, isAdminOrPremium, async (req, res, next) => {
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

		productToAdd.owner = req.user.user.email;

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
productsRouter.put('/:pid', middlewarePassportJWT, isAdminOrPremium, async (req, res, next) => {
	

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
productsRouter.delete('/:pid', middlewarePassportJWT, isAdminOrPremium, async (req, res, next) => {
	
	try {
		let idBuscado = req.params.pid;
		let prodToDel = await productController.getProductsById(idBuscado);
		let product;

		if ((req.user.user.role === 'premium' && prodToDel[0].owner === req.user.user.email) || req.user.user.role === 'admin') {
			product = await productController.deleteProduct(idBuscado);
		} else {
			CustomError.createError({
				name: 'Product Delete error',
				cause: `User Premium try to delete product with another owner`,
				message: 'Error trying to delete product',
				code: EErrors.DELETE_ERROR,
			});
		}

		if (!product === EErrors.DELETE_ERROR) {
			CustomError.createError({
				name: 'Product Delete error',
				cause: generateDeleteProductErrorInfo(idBuscado),
				message: 'Error trying to delete product',
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
